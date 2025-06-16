// RegisterFingerprint.jsx
import React from 'react';
import { startRegistration } from '@simplewebauthn/browser';
import axios from 'axios';

const jwt = localStorage.getItem('jwt');

const RegisterFingerprint = () => {
    const handleRegister = async () => {
        try {
            const optionsRes = await axios.get('http://localhost:9092/webauthn/register/options', {
                headers: { Authorization: `Bearer ${jwt}` },
            });

            const attResp = await startRegistration(optionsRes.data);

            await axios.post('http://localhost:9092/webauthn/register/verify', attResp, {
                headers: { Authorization: `Bearer ${jwt}` },
            });

            alert('Fingerprint registered successfully!');
        } catch (err) {
            console.error(err);
            alert('Registration failed!');
        }
    };

    return (
        <div>
            <h2>Register Fingerprint</h2>
            <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 rounded">
                Register Fingerprint
            </button>
        </div>
    );
};

export default RegisterFingerprint;