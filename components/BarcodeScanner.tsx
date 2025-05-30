'use client';

import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga'; // Quagga works best for barcodes only

interface Props {
    onDetected: (result: string) => void;
}

const BarcodeScanner: React.FC<Props> = ({ onDetected }) => {
    const [error, setError] = useState<string | null>(null);
    const [scanning, setScanning] = useState(true);
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!videoRef.current) return;

        Quagga.init(
            {
                inputStream: {
                    name: 'Live',
                    type: 'LiveStream',
                    target: videoRef.current,
                    constraints: {
                        facingMode: 'environment' // rear camera
                    }
                },
                decoder: {
                    readers: ['ean_reader', 'code_128_reader', 'code_39_reader', 'upc_reader']
                },
                locate: true
            },
            (err: any) => {
                if (err) {
                    console.error(err);
                    setError('Camera initialization failed');
                    return;
                }
                Quagga.start();
            }
        );

        Quagga.onDetected((data: any) => {
            const code = data.codeResult.code;
            if (code) {
                setScanning(false);
                onDetected(code);
                Quagga.stop();
            }
        });

        return () => {
            Quagga.offDetected(() => { });
            Quagga.stop();
        };
    }, [onDetected]);

    return (
        <div className="flex flex-col items-center">
            {error && <p className="text-red-600">{error}</p>}
            {scanning && <p className="text-sm text-gray-500 mb-2">Scanning for barcode...</p>}
            <div
                ref={videoRef}
                style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
            />
        </div>
    );
};

export default BarcodeScanner;
