'use client';
import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useMutation } from '@tanstack/react-query';
import { uploadReceiptApi } from '@/app/services/Media';
import { scanReceiptApi } from '@/app/services/TransactionService';
import { ScannedResult } from '@/app/types/scan';
import { useAuthStore } from '@/app/store/useAuthStore';
import useTrackProgress from '@/app/_hooks/useTrackProgress';

type Props = {
  setScanState: React.Dispatch<React.SetStateAction<boolean>>;
  setScannedResults: React.Dispatch<React.SetStateAction<ScannedResult | null>>;
  setUploadedImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setShowReceiptDetails: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useScanner({
  setScanState,
  setUploadedImageUrl,
  setScannedResults,
  setShowReceiptDetails,
}: Props) {
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>(
    'environment',
  );
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);

  const { userData } = useAuthStore();
  const { trackProgressMutation } = useTrackProgress();

  const uploadReceiptMutation = useMutation({
    mutationFn: (file: File) => uploadReceiptApi(userData?.token ?? '', file),
    onSuccess: (data) => {
      console.log('Receipt uploaded successfully:', data);
      setUploadedImageUrl(data.url);
      setIsCameraActive(false);
    },
    onError: (error) => {
      console.error('Error uploading receipt:', error);
    },
  });

  const scanReceiptMutation = useMutation({
    mutationFn: (url: string) => scanReceiptApi(userData?.token ?? '', url),
    onSuccess: (data) => {
      console.log('Receipt scanned successfully:', data);
      trackProgressMutation.mutate('receipt_scanning');

      setIsCameraActive(false);

      setShowReceiptDetails(data);
      setScannedResults(data);
      setScanState(false);
    },
    onError: (error) => {
      console.error('Error scanning receipt:', error);
    },
  });

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setIsCameraActive(true);
      } catch (error) {
        alert('Camera permission is required to use this feature.');
      }
    };

    requestCameraPermission();
  }, []);

  const stopCamera = () => {
    const videoElement = webcamRef.current?.video;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop(); // stop each media track
      });
      videoElement.srcObject = null;
    }
    setScanState(false);
    setIsCameraActive(false);
  };

  const handleCaptureAndScan = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      alert('Failed to capture the image!');
      return;
    }

    const response = await fetch(imageSrc);
    const blob = await response.blob();
    const file = new File([blob], 'receipt.jpg', { type: blob.type });

    try {
      const uploadedUrl = await uploadReceiptMutation.mutateAsync(file);
      setIsCameraActive(false);
      await scanReceiptMutation.mutateAsync(uploadedUrl);
    } catch (error) {
      console.error('Error in capture and scan:', error);
    }
  };

  return {
    cameraFacingMode,
    setCameraFacingMode,
    isCameraActive,
    setIsCameraActive,
    scanReceiptMutation,
    handleCaptureAndScan,
    uploadReceiptMutation,
    webcamRef,
    stopCamera,
  };
}
