import React from "react";
import axios from "axios";
import Html5QrScanner from "./components/QrScannner.jsx";
import { useNavigate } from "react-router-dom";


const jwt = localStorage.getItem("jwt");

const ScanPage = () => {
    const navigate = useNavigate();
    const handleScan = async (token) => {
        console.log("Scanned token:", token);
        try {
            const res = await axios.post(
                "http://localhost:9092/qr/verifyQR",
                { token }, // include the scanned token in the request body
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            if(res) {
                navigate("/pay");
            }
            console.log("Backend response:", res.data);
        } catch (err) {
            console.error("Failed to send token:", err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Scan QR Code</h1>
            <Html5QrScanner onScanSuccess={handleScan} />
        </div>
    );
};

export default ScanPage;