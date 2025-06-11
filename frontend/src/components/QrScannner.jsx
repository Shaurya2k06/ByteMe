import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Html5QrScanner = ({ onScanSuccess }) => {
    const qrCodeRegionId = "html5qr-reader";
    const scannerRef = useRef(null);

    useEffect(() => {
        if (!scannerRef.current) {
            const html5QrCode = new Html5Qrcode(qrCodeRegionId);
            scannerRef.current = html5QrCode;

            html5QrCode
                .start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    (decodedText, decodedResult) => {
                        console.log("Decoded:", decodedText);
                        onScanSuccess(decodedText);
                        html5QrCode.stop();
                    },
                    (errorMessage) => {
                        // ignore scan errors
                    }
                )
                .catch((err) => {
                    console.error("Camera init error:", err);
                });
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().then(() => {
                    scannerRef.current.clear();
                });
            }
        };
    }, []);

    return <div id={qrCodeRegionId} style={{ width: "100%" }} />;
};

export default Html5QrScanner;