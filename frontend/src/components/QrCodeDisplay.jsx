// QrCodeDisplay.jsx
import React from "react";
import { QRCode } from "qrcode.react";

const QrCodeDisplay = ({ token }) => {
    if (!token) return <p>No token to display</p>;

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h3>Your QR Code</h3>
            <QRCode
                value={token}
                size={256}
                level={"H"}
                includeMargin={true}
            />
            <p style={{ marginTop: "10px", wordBreak: "break-all" }}>
                Token: {token}
            </p>
        </div>
    );
};

export default QrCodeDisplay;