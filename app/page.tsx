'use client';

import { useState } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';

export default function ScanPage() {
  const [result, setResult] = useState<string | null>(null);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">📦 Scan Product Code</h1>
      {!result ? (
        <BarcodeScanner onDetected={(code) => setResult(code)} />
      ) : (
        <div className="bg-green-100 text-green-800 p-4 rounded">
          <p>✅ Detected Code:</p>
          <pre className="text-lg">{result}</pre>
        </div>
      )}
    </div>
  );
}
