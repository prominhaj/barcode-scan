'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface BarcodeScannerProps {
    onDetected: (result: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        let selectedDeviceId: string;

        BrowserMultiFormatReader.listVideoInputDevices()
            .then((videoInputDevices) => {
                if (videoInputDevices.length === 0) {
                    throw new Error('No camera found');
                }

                selectedDeviceId = videoInputDevices[0].deviceId;

                codeReader.decodeFromVideoDevice(
                    selectedDeviceId,
                    videoRef.current!,
                    (result, error) => {
                        if (result) {
                            onDetected(result.getText());

                            // Safely stop scanning
                            if ('reset' in codeReader && typeof codeReader.reset === 'function') {
                                codeReader.reset();
                            } else {
                                console.warn('Unable to stop scanner; no reset method');
                            }
                        }

                        if (error && !(error.name === 'NotFoundException')) {
                            console.error('Scan error', error);
                        }
                    }
                );
            })
            .catch((err: any) => setError(err.message));

        return () => {
            // Cleanup on unmount
            if ('reset' in codeReader && typeof codeReader.reset === 'function') {
                codeReader.reset();
            }
        };
    }, [onDetected]);

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
        </div>
    );
};

export default BarcodeScanner;
