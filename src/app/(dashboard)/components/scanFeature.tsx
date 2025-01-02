'use client'
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
    const [showModal, setShowModal] = useState(false);
    const { authenticatedUser } = useAuthentication();

    const uploadReceiptMutation = useMutation({
        mutationFn: (file: File) => uploadReceiptApi(authenticatedUser?.token ?? '', file),
        onSuccess: (data) => {
            console.log("Receipt uploaded successfully:", data);
            setUploadedImageUrl(data.url);
            setIsCameraActive(false)

        },
        onError: (error) => {
            console.error("Error uploading receipt:", error);
        },
    });

    const scanReceiptMutation = useMutation({
        mutationFn: (url: string) => scanReceiptApi(authenticatedUser?.token ?? '', url),
        onSuccess: (data) => {
            console.log("Receipt scanned successfully:", data);
            setIsCameraActive(false)
            setScanResult(data);
            setShowModal(true); // Show modal with the scan result

        },
        onError: (error) => {
            console.error("Error scanning receipt:", error);
        },
    });

    useEffect(() => {
        const requestCameraPermission = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
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
            setIsCameraActive(false)
            await scanReceiptMutation.mutateAsync(uploadedUrl);
        } catch (error) {
            console.error("Error in capture and scan:", error);
        }
    };

    return (
        <div className="relative">
            {!isCameraActive && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                    <button
                        onClick={() => setScanState(false)}
                        className="text-red-800 bg-white border-red-800 border rounded-md px-2 py-1 absolute top-[5%] right-[5%]"
                    >
                        x
                    </button>
                    <button
                        onClick={() => setIsCameraActive(true)}
                        className="bg-[#4A9F11] mx-auto text-[#FAFAFA] py-2 px-4 rounded"
                    >
                        Open Camera
                    </button>
                </div>
            )}

            {scanReceiptMutation.isPending &&

                <>
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-50">
                        <div className="bg-white flex justify-center gap-5  items-center w-full h-full p-6 rounded-lg shadow-lg text-center">
                            <div className="loader mb-4"></div>
                            <div className="text-lg font-semibold">Scanning...</div>
                        </div>
                    </div>


                    <style jsx>{`
             .loader {
                 border: 4px solid #f3f3f3;
                 border-radius: 50%;
                 border-top: 4px solid #3498db;
                 width: 40px;
                 height: 40px;
                 animation: spin 2s linear infinite;
             }
         
             @keyframes spin {
                 0% { transform: rotate(0deg); }
                 100% { transform: rotate(360deg); }
             }
         `}</style>
                </>
            }

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
                            onClick={() => setScanState(false)}
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

            {showModal && scanResult && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-semibold  text-left ">Scan Result:</h2>
                        <div className="mt-4 text-left">
                            <h1><strong>Merchant:</strong> {scanResult?.merchantName}</h1>
                            <h1><strong>Amount:</strong> ${scanResult?.amount}</h1>
                            <h1><strong>Date:</strong> {new Date(scanResult?.date).toLocaleDateString()}</h1>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-red-600 text-white py-2 px-4 rounded mt-4 w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scanner;
