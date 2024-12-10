import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useMutation } from "@tanstack/react-query";
import { uploadReceiptApi } from "@/app/services/Media";
import { scanReceiptApi } from "@/app/services/TransactionService";
import { useAuthentication } from "@/app/store/AuthStore";
import Image from "next/image";

const Scanner: React.FC = () => {
    const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("environment");
    const webcamRef = useRef<Webcam>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [scanResult, setScanResult] = useState<any | null>(null);
    const { authenticatedUser } = useAuthentication();

    // Mutation to handle receipt upload
    const uploadReceiptMutation = useMutation({
        mutationFn: (file: File) => uploadReceiptApi(authenticatedUser?.token ?? '', file),
        onSuccess: (data) => {
            console.log("Receipt uploaded successfully:", data);
            setUploadedImageUrl(data.url); // Save the uploaded URL for scanning
            console.log(data);

        },
        onError: (error) => {
            console.error("Error uploading receipt:", error);
        },
    });

    // Mutation to handle receipt scanning
    const scanReceiptMutation = useMutation({
        mutationFn: (url: string) => scanReceiptApi(authenticatedUser?.token ?? '', url),
        onSuccess: (data) => {
            console.log("Receipt scanned successfully:", data);
            setScanResult(data); // Display the scan result
        },
        onError: (error) => {
            console.error("Error scanning receipt:", error);
        },
    });

    const handleCaptureAndScan = async () => {
        if (!webcamRef.current) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            alert("Failed to capture the image!");
            return;
        }

        // Convert the captured image to a Blob
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], "receipt.jpg", { type: blob.type });

        // Upload the receipt
        try {
            const uploadedUrl = await uploadReceiptMutation.mutateAsync(file);

            // Scan the uploaded receipt
            await scanReceiptMutation.mutateAsync(uploadedUrl);
        } catch (error) {
            console.error("Error in capture and scan:", error);
        }
    };

    return (
        <div className="flex flex-col items-center ">
            {scanResult ? null :
                <>

                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            facingMode: cameraFacingMode,
                        }}
                        className="border rounded-md"
                        style={{ width: "100%", maxWidth: "100%", height: "300px" }}
                    />
                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={() =>
                                setCameraFacingMode((prev) => (prev === "user" ? "environment" : "user"))
                            }
                            className="bg-[#121212] text-white py-2 px-4 rounded"
                        >
                            Switch Camera
                        </button>
                        <button
                            onClick={handleCaptureAndScan}
                            className="bg-[#4A9F11] text-[#FAFAFA] py-2 px-4 rounded"
                            disabled={scanReceiptMutation?.isPending || uploadReceiptMutation.isPending} // Disable button while processing
                        >
                            {scanReceiptMutation.isPending || uploadReceiptMutation.isPending
                                ? "Scanning..."
                                : "Scan Receipt"}
                        </button>
                    </div>
                </>
            }

            {uploadedImageUrl && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Uploaded Image:</h2>
                    <Image
                        width={1000}
                        height={1000}
                        src={uploadedImageUrl}
                        alt="Uploaded Receipt" className="mt-2 rounded-md size-[10rem] " />

                </div>
            )}
            {scanResult && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Scan Result:</h2>
                    <pre className=" p-4 rounded">{JSON.stringify(scanResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Scanner;
