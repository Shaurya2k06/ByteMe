// FingerprintAuth.jsx
import React from 'react';
import { startAuthentication } from '@simplewebauthn/browser';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const jwt = localStorage.getItem('jwt');

const FingerprintAuth = () => {
    const navigate = useNavigate();

    const handleAuth = async () => {
        try {
            const optionsRes = await axios.get('http://localhost:9092/webauthn/auth/options', {
                headers: { Authorization: `Bearer ${jwt}` },
            });

            const asseResp = await startAuthentication(optionsRes.data);

            const verifyRes = await axios.post('http://localhost:9092/webauthn/auth/verify', asseResp, {
                headers: { Authorization: `Bearer ${jwt}` },
            });

            if (verifyRes.data.verified) {
                alert('Authentication successful!');
                navigate('/pay'); // or wherever your payment flow goes
            } else {
                alert('Authentication failed');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong during auth');
        }
    };

    return (
        <div>
            <h2>Verify Fingerprint</h2>
            <button onClick={handleAuth} className="bg-green-600 text-white px-4 py-2 rounded">
                Verify & Proceed to Pay
            </button>
        </div>
    );
};

export default FingerprintAuth;