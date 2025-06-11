import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

const QrPage = () => {
    const [token, setToken] = useState("");
    const qrRef = useRef();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        const loadOrCreateQrToken = async () => {
            const storedToken = localStorage.getItem("qrToken");
            const storedTimestamp = localStorage.getItem("qrTokenTimestamp");

            const ageInMs = Date.now() - parseInt(storedTimestamp || "0");
            const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

            if (storedToken && ageInMs < thirtyDaysInMs) {
                setToken(storedToken);
                return;
            }

            try {
                const response = await axios.get("http://localhost:9092/qr/createQR", {
                    headers: { Authorization: `Bearer ${jwt}` },
                });

                const newToken = response.data.qrToken;
                setToken(newToken);
                localStorage.setItem("qrToken", newToken);
                localStorage.setItem("qrTokenTimestamp", Date.now().toString());
            } catch (error) {
                console.error("Error generating QR:", error);
            }
        };

        loadOrCreateQrToken();
    }, [navigate]);

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write("<html><head><title>Print QR</title></head><body>");
        printWindow.document.write(qrRef.current.outerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Your QR Code</h2>

                {token ? (
                    <>
                        <div ref={qrRef} style={styles.qrWrapper}>
                            <QRCode value={token} size={220} />
                        </div>
                        <p style={styles.tokenInfo}>
                            Token valid for 30 days. Scan this to pay securely.
                        </p>
                        <div style={styles.actions}>
                            <button onClick={handlePrint} style={styles.printButton}>
                                🖨️ Print QR
                            </button>
                            <button onClick={() => navigate("/pay")} style={styles.payButton}>
                                💳 Go to Pay
                            </button>
                        </div>
                    </>
                ) : (
                    <p style={styles.loading}>Loading QR code...</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "20px",
    },
    card: {
        backgroundColor: "#fff",
        padding: "40px 30px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%",
        animation: "fadeIn 0.5s ease-in-out",
    },
    title: {
        marginBottom: "24px",
        color: "#333",
        fontSize: "24px",
    },
    qrWrapper: {
        padding: "16px",
        backgroundColor: "#fafafa",
        borderRadius: "12px",
        display: "inline-block",
        boxShadow: "inset 0 0 8px rgba(0,0,0,0.05)",
        transition: "transform 0.3s ease-in-out",
    },
    tokenInfo: {
        marginTop: "12px",
        fontSize: "14px",
        color: "#666",
    },
    loading: {
        fontSize: "16px",
        color: "#999",
    },
    actions: {
        marginTop: "24px",
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        flexWrap: "wrap",
    },
    printButton: {
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "8px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        cursor: "pointer",
        transition: "background 0.3s",
    },
    payButton: {
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "8px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        cursor: "pointer",
        transition: "background 0.3s",
    },
};

export default QrPage;