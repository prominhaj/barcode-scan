'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    BrowserMultiFormatReader,
    BarcodeFormat
} from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';

interface Props {
    onDetected: (result: string) => void;
}

const BarcodeScanner: React.FC<Props> = ({ onDetected }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanning, setScanning] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        // Optional: Improve detection with hints
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.CODE_128,
            BarcodeFormat.CODE_39,
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
            BarcodeFormat.UPC_A,
            BarcodeFormat.UPC_E,
            BarcodeFormat.QR_CODE
        ]);

        BrowserMultiFormatReader.listVideoInputDevices()
            .then((devices) => {
                if (!devices.length) throw new Error('No camera devices found');

                // Prefer rear camera if available
                const backCamera = devices.find((d) =>
                    /back|rear|environment/i.test(d.label)
                );
                const deviceId = backCamera?.deviceId || devices[0].deviceId;

                codeReader
                    .decodeFromVideoDevice(
                        deviceId,
                        videoRef.current!,
                        (result, err) => {
                            setLoading(false);

                            if (result) {
                                setScanning(false);
                                onDetected(result.getText());

                                // Stop scanning
                                if ('reset' in codeReader && typeof codeReader.reset === 'function') {
                                    codeReader.reset();
                                }
                            } else if (err && err.name !== 'NotFoundException') {
                                console.warn('Scan error', err);
                            }
                        }
                    )
                    .catch((e) => {
                        console.error(e);
                        setError('Failed to start video decoding');
                    });
            })
            .catch((e) => {
                console.error(e);
                setError('No accessible video input devices');
            });

        return () => {
            if ('reset' in codeReader && typeof codeReader.reset === 'function') {
                codeReader.reset();
            }
        };
    }, [onDetected]);

    return (
        <div className="flex flex-col items-center justify-center">
            {loading && <p className="text-sm text-gray-500 mb-2">Loading camera...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <video
                ref={videoRef}
                style={{ width: '100%', maxWidth: '500px', borderRadius: '8px' }}
                autoPlay
                muted
            />
            {!scanning && (
                <p className="text-green-600 font-medium mt-2">✅ Code scanned!</p>
            )}
        </div>
    );
};

export default BarcodeScanner;
