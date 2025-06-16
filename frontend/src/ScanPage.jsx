import React, { useState } from "react";
import axios from "axios";
import Html5QrScanner from "./components/QrScannner.jsx";
import { useNavigate } from "react-router-dom";

const ScanPage = () => {
    const [scanStatus, setScanStatus] = useState("");
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    const handleScan = async (token) => {
        console.log("Scanned token:", token);
        setScanStatus("Verifying...");

        try {
            const res = await axios.post(
                "http://localhost:9092/qr/verifyQR",
                { token },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            console.log("Backend response:", res.data);
            setScanStatus("✅ Verified! Redirecting...");
            setTimeout(() => navigate("/pay"), 1000);
        } catch (err) {
            console.error("Failed to send token:", err);
            setScanStatus("❌ Invalid QR code. Please try again.");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>📷 Scan QR Code</h1>
                <Html5QrScanner onScanSuccess={handleScan} />
                {scanStatus && <p style={styles.status}>{scanStatus}</p>}
            </div>
        </div>
    );
};

const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #e0eafc, #cfdef3)",
        padding: "20px",
        fontFamily: "'Segoe UI', sans-serif",
    },
    card: {
        background: "rgba(255, 255, 255, 0.95)",
        padding: "30px 20px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        width: "100%",
        maxWidth: "500px",
    },
    title: {
        fontSize: "26px",
        fontWeight: "600",
        marginBottom: "20px",
        color: "#333",
    },
    status: {
        marginTop: "16px",
        fontSize: "16px",
        color: "#555",
    },
};

export default ScanPage;