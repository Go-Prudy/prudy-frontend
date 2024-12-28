import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useMutation } from "@tanstack/react-query";
import { uploadReceiptApi } from "@/app/services/Media";
import { scanReceiptApi } from "@/app/services/TransactionService";
import { useAuthentication } from "@/app/store/AuthStore";
import Image from "next/image";

const Scanner: React.FC<{ scanState: boolean, setScanState: React.Dispatch<React.SetStateAction<boolean>> }> = ({ scanState, setScanState }) => {
    const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("environment");
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [scanResult, setScanResult] = useState<any | null>(null);
    const { authenticatedUser } = useAuthentication();

    // Mutation to handle receipt upload
    const uploadReceiptMutation = useMutation({
        mutationFn: (file: File) => uploadReceiptApi(authenticatedUser?.token ?? '', file),
        onSuccess: (data) => {
            console.log("Receipt uploaded successfully:", data);
            setUploadedImageUrl(data.url);
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
            setScanResult(data);
        },
        onError: (error) => {
            console.error("Error scanning receipt:", error);
        },
    });

    // Immediately attempt to activate the camera on component mount
    useEffect(() => {
        const requestCameraPermission = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true }); // Immediately request camera permission
                setIsCameraActive(true);
            } catch (error) {
                alert("Camera permission is required to use this feature.");
            }
        };

        requestCameraPermission();
    }, []);

    const handleCaptureAndScan = async () => {
        if (!webcamRef.current) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            alert("Failed to capture the image!");
            return;
        }

        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], "receipt.jpg", { type: blob.type });

        try {
            const uploadedUrl = await uploadReceiptMutation.mutateAsync(file);
            await scanReceiptMutation.mutateAsync(uploadedUrl);
        } catch (error) {
            console.error("Error in capture and scan:", error);
        }
    };

    return (
        <div className="   ">
            {!isCameraActive && (
                <div className="bg-white p-9 z-50 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white p-3 h-[10rem] grid place-content-center w-[10rem]">
                        <button onClick={() => setScanState(false)} className="text-red-800 bg-white border-red-800 border rounded-md px-2 py-1 absolute top-[5%] right-[5%]">x</button>

                        <button
                            onClick={() => setIsCameraActive(true)}
                            className="bg-[#4A9F11] mx-auto text-[#FAFAFA] py-2 px-4 rounded"
                        >
                            Open Camera
                        </button>
                    </div>
                </div>
            )}

            {isCameraActive && (
                <div className="fixed inset-0 bg-black flex flex-col justify-center items-center z-50">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            facingMode: cameraFacingMode,
                        }}
                        className="w-full min-h-[100vh] object-cover"
                    />
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => setIsCameraActive(false)}
                            className="bg-red-600 text-white py-2 px-4 rounded"
                        >
                            Close Camera
                        </button>
                    </div>
                    <div className="absolute bottom-4 flex space-x-4">
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
                            disabled={scanReceiptMutation.isPending || uploadReceiptMutation.isPending}
                        >
                            {scanReceiptMutation.isPending || uploadReceiptMutation.isPending
                                ? "Scanning..."
                                : "Scan Receipt"}
                        </button>
                    </div>
                </div>
            )}

            {uploadedImageUrl && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Uploaded Image:</h2>
                    <Image
                        width={1000}
                        height={1000}
                        src={uploadedImageUrl}
                        alt="Uploaded Receipt"
                        className="mt-2 rounded-md"
                    />
                </div>
            )}
            {scanResult && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Scan Result:</h2>
                    <pre className="p-4 rounded">{JSON.stringify(scanResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Scanner;
