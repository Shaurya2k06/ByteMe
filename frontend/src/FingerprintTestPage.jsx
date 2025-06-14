import React, { useState } from 'react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import axios from 'axios';

const FingerprintTestPage = () => {
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('jwt');

    if (!token) {
        return (
            <div className="p-8 max-w-xl mx-auto space-y-6">
                <h2 className="text-2xl font-semibold">🔐 Fingerprint Authentication</h2>
                <p className="text-red-600">You must be logged in to use fingerprint authentication.</p>
            </div>
        );
    }

    const api = axios.create({
        baseURL: 'http://localhost:9092',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const handleRegister = async () => {
        setLoading(true);
        try {
            // 1. Get registration options from server
            const { data: options } = await api.post('/biometric/register/options');
            console.log(options)
            if (!options || !options.challenge) {
                throw new Error('Invalid registration options from server');
            }

            // 2. Pass options to browser WebAuthn
            const attestationResponse = await startRegistration(options);

            // 3. Send attestation response to server for verification
            const { data: verifyResult } = await api.post('/biometric/register/verify', attestationResponse);


            if (verifyResult?.success) {
                alert('✅ Fingerprint registered!');
            } else {
                alert('❌ Verification failed!');
            }
        } catch (err) {
            console.error('Registration error:', err);
            alert('❌ Registration failed: ' + (err?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleAuthenticate = async () => {

        setLoading(true);
        try {
            // 1. Get authentication options from server
            const { data: options } = await api.post('/biometric/auth/options');
            console.log(options)
            if (!options || !options.challenge) {
                throw new Error('Invalid authentication options from server');
            }

            // 2. Start WebAuthn authentication
            const assertionResponse = await startAuthentication(options);

            // 3. Send response to server for verification
            const { data: result } = await api.post('/biometric/auth/verify', assertionResponse);

            if (result?.success) {
                alert('✅ Authentication success!');
            } else {
                alert('❌ Authentication failed!');
            }
        } catch (err) {
            console.error('Authentication error:', err);
            alert('❌ Authentication failed: ' + (err?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold">🔐 Fingerprint Authentication</h2>

            <button
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={handleRegister}
                disabled={loading}
                type="button"
            >
                {loading ? 'Registering...' : '📌 Register Fingerprint'}
            </button>

            <button
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                onClick={handleAuthenticate}
                disabled={loading}
                type="button"
            >
                {loading ? 'Verifying...' : '✅ Verify Fingerprint'}
            </button>
        </div>
    );
};

export default FingerprintTestPage;