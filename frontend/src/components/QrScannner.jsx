import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Html5QrScanner = ({ onScanSuccess }) => {
    const qrCodeRegionId = "html5qr-reader"; // Use string ID directly
    const [error, setError] = useState(null);

    useEffect(() => {
        const html5QrCode = new Html5Qrcode(qrCodeRegionId);

        Html5Qrcode.getCameras()
            .then((devices) => {
                if (!devices || devices.length === 0) {
                    throw new Error("No cameras found");
                }

                const backCam = devices.find((d) =>
                    d.label.toLowerCase().includes("back")
                );
                const selectedDeviceId = backCam ? backCam.id : devices[0].id;

                html5QrCode
                    .start(
                        selectedDeviceId,
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 },
                        },
                        (decodedText) => {
                            console.log("Decoded:", decodedText);
                            onScanSuccess(decodedText);

                            html5QrCode.stop().then(() => {
                                html5QrCode.clear();
                            });
                        },
                        (errorMessage) => {
                            // scan errors are ignored
                        }
                    )
                    .catch((err) => {
                        console.error("Start failed:", err);
                        setError("Failed to start camera: " + err.message);
                    });
            })
            .catch((err) => {
                console.error("Camera access error:", err);
                setError("Camera error: " + err.message);
            });

        return () => {
            html5QrCode
                .stop()
                .then(() => html5QrCode.clear())
                .catch((err) => console.warn("Stop error:", err));
        };
    }, [onScanSuccess]);

    return (
        <div className="flex flex-col items-center">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div
                id={qrCodeRegionId}
                style={{ width: "300px", height: "300px" }}
            />
        </div>
    );
};

export default Html5QrScanner;