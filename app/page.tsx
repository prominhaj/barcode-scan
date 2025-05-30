'use client';

import BarcodeScanner from '@/components/BarcodeScanner';
import { useState } from 'react';

export default function ScanPage() {
  const [code, setCode] = useState('');

  const handleDetected = (result: string) => {
    setCode(result);
    alert(`Scanned Barcode: ${result}`);
    // You can also make an API call to fetch product data
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Scan Product Barcode</h1>
      <BarcodeScanner onDetected={handleDetected} />
      {code && <p className="mt-4">Scanned Code: {code}</p>}
    </div>
  );
}
