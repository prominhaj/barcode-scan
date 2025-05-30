'use client';

import BarcodeScanner from '@/components/BarcodeScanner';
import { useState } from 'react';

export default function ScanPage() {
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📦 Scan Product Code</h1>

      {!scannedCode ? (
        <BarcodeScanner onDetected={(result) => setScannedCode(result)} />
      ) : (
        <div className="bg-green-100 text-green-800 p-4 rounded">
          <p>✅ Scanned Result:</p>
          <pre className="text-lg">{scannedCode}</pre>
        </div>
      )}
    </div>
  );
}
