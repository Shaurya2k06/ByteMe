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
                const response = await axios.get("https://byteme-ue8b.onrender.com/qr/createQR", {
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
    const handleGenerateNewQR = async () => {
        try {
            const response = await axios.get("https://byteme-ue8b.onrender.com/qr/createQR", {
                headers: { Authorization: `Bearer ${jwt}` },
            });

            const newToken = response.data.qrToken;
            setToken(newToken);
            localStorage.setItem("qrToken", newToken);
            localStorage.setItem("qrTokenTimestamp", Date.now().toString());
        } catch (error) {
            console.error("Error generating new QR:", error);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>🔐 Secure QR Payment</h2>

                {token ? (
                    <>
                        <div ref={qrRef} style={styles.qrWrapper}>
                            <QRCode value={token} size={220} />
                        </div>
                        <p style={styles.tokenInfo}>
                            Your QR code is valid for <strong>30 days</strong>. Scan it to make a payment securely.
                        </p>
                        <div style={styles.actions}>
                            <button onClick={handlePrint} style={{...styles.button, ...styles.printButton}}>
                                🖨️ Print QR
                            </button>
                            <button onClick={() => navigate("/pay")} style={{...styles.button, ...styles.payButton}}>
                                💳 Go to Pay
                            </button>
                            <button onClick={handleGenerateNewQR}
                                    style={{...styles.button, backgroundColor: "#ffc107", color: "#000"}}>
                                🔄 Generate New QR
                            </button>
                        </div>
                    </>
                ) : (
                    <p style={styles.loading}>⏳ Generating your QR code...</p>
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
        background: "linear-gradient(135deg, #f0f2f5, #d6e4f0)",
        padding: "20px",
        fontFamily: "'Segoe UI', sans-serif",
    },
    card: {
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        padding: "40px 30px",
        borderRadius: "20px",
        boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "420px",
        width: "100%",
        transition: "transform 0.3s ease",
    },
    title: {
        marginBottom: "24px",
        color: "#222",
        fontSize: "28px",
        fontWeight: "600",
    },
    qrWrapper: {
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        display: "inline-block",
        boxShadow: "0 6px 12px rgba(0,0,0,0.05)",
    },
    tokenInfo: {
        marginTop: "18px",
        fontSize: "15px",
        color: "#555",
        lineHeight: "1.6",
    },
    loading: {
        fontSize: "16px",
        color: "#888",
    },
    actions: {
        marginTop: "30px",
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        flexWrap: "wrap",
    },
    button: {
        padding: "12px 22px",
        fontSize: "15px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "500",
        transition: "all 0.3s ease",
    },
    printButton: {
        backgroundColor: "#28a745",
        color: "#fff",
    },
    payButton: {
        backgroundColor: "#007bff",
        color: "#fff",
    },
};

export default QrPage;