'use client';
import React from 'react';
import Webcam from 'react-webcam';
import { ScannedResult } from '@/app/types/scan';
import useScanner from './useScanner';

const Scanner: React.FC<{
  setScanState: React.Dispatch<React.SetStateAction<boolean>>;
  setScannedResults: React.Dispatch<React.SetStateAction<ScannedResult | null>>;
  setUploadedImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setShowReceiptDetails: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  setScanState,
  setUploadedImageUrl,
  setScannedResults,
  setShowReceiptDetails,
}) => {
  const {
    cameraFacingMode,
    setCameraFacingMode,
    isCameraActive,
    setIsCameraActive,
    scanReceiptMutation,
    handleCaptureAndScan,
    uploadReceiptMutation,
    webcamRef,
    stopCamera,
  } = useScanner({
    setScanState,
    setUploadedImageUrl,
    setScannedResults,
    setShowReceiptDetails,
  });

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

      {scanReceiptMutation.isPending && (
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
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </>
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
              onClick={() => stopCamera()}
              className="bg-red-600 text-white py-2 px-4 rounded"
            >
              Close Camera
            </button>
          </div>
          <div className="absolute bottom-4 flex space-x-4">
            <button
              onClick={() =>
                setCameraFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
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
                ? 'Scanning...'
                : 'Scan Receipt'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
