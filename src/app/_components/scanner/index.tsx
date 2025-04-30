import React, { useState } from 'react';
import ReceiptDetails from './receiptDetails';
import { ScannedResult } from '@/app/types/scan';
import Scanner from './scan';

type Props = {
  showScanner: boolean;
  setShowScanner: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ScanReceipt({ showScanner, setShowScanner }: Props) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [scannedResults, setScannedResults] = useState<ScannedResult | null>(null);
  const [showReceiptDetails, setShowReceiptDetails] = useState<boolean>(false);
  return (
    <>
      {showScanner && (
        <Scanner
          setScanState={setShowScanner}
          setScannedResults={setScannedResults}
          setUploadedImageUrl={setUploadedImageUrl}
          setShowReceiptDetails={setShowReceiptDetails}
        />
      )}
      {showReceiptDetails && (
        <ReceiptDetails
          scannedResults={scannedResults}
          uploadedImageUrl={uploadedImageUrl}
          setScannedResults={setScannedResults}
        />
      )}
    </>
  );
}
