const {
    generateRegistrationOptions: libGenerateRegistrationOptions,
    verifyRegistrationResponse: libVerifyRegistrationResponse,
    generateAuthenticationOptions: libGenerateAuthenticationOptions,
    verifyAuthenticationResponse: libVerifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const base64url = require('base64url');
const User = require('../Model/User');

const rpName = 'ByteMe';
const rpID = 'localhost';
const origin = 'http://localhost:5173';


// 1. Generate Registration Options
async function generateRegistrationOptionsHandler(req, res) {
    console.log(1)
    const userEmail = req.user?.userEmail;
    const user = await User.findOne({ userEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Use hex encoding for MongoDB ObjectId
    const userIDBuffer = Buffer.from(user._id.toString(), 'hex');

    const options = await libGenerateRegistrationOptions({
        rpName,
        rpID,
        userID: userIDBuffer,
        userName: user.userName,
        attestationType: 'none',
        authenticatorSelection: {
            userVerification: 'preferred',
        },
        timeout: 60000,
    });

    user.challenge = options.challenge;
    user.webauthnUserID = base64url.encode(userIDBuffer);
    await user.save();
    // console.log(user)
    // console.log(options)

    return res.json(options);
}

// 2. Verify Registration Response
async function verifyRegistrationResponseHandler(req, res) {
    console.log(2)
    const userEmail = req.user?.userEmail;
    const body = req.body;
    const user = await User.findOne({ userEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let verification;
    try {
        verification = await libVerifyRegistrationResponse({
            response: body,
            expectedChallenge: user.challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: 'Verification failed' });
    }
    // console.log(verification)

    const { verified, registrationInfo } = verification;

    console.log(3)
    // console.log(verified)
    // console.log(registrationInfo)

    if (verified && registrationInfo) {
        const { credential, counter } = registrationInfo;

        let {publicKey : credentialPublicKey, id : credentialID} = credential;
        // Defensive check
        if (!credentialID || !credentialPublicKey) {
            return res.status(400).json({ message: 'Registration info missing credentialID or credentialPublicKey' });
        }

        if (typeof credentialID === 'string') {
            credentialID = base64url.toBuffer(credentialID);
        }


        // rawCredentialID = base64url.toBuffer(rawCredentialID);

        console.log("hmmm")
        console.log("typeof credentialID:", typeof credentialID); // string
        // console.log("encoded credentialID:", typeof base64url.encode(credentialID)); // should be string
        user.webauthn = {
            credentialID: base64url.encode(credentialID),
            publicKey: base64url.encode(credentialPublicKey),
            counter,
            deviceType: body.response?.authenticatorAttachment,
            transports: body.response?.transports || [],
        };

        user.challenge = undefined;
        await user.save();
    }


    return res.json({ success: verified });
}



// 3. Generate Authentication Options
async function generateAuthOptionsHandler(req, res) {
    console.log(4)
    const userEmail = req.user?.userEmail;
    const user = await User.findOne({ userEmail });

    // // Defensive check for registered credential
    // console.log(  "cred id "+user.webauthn?.credentialID)
    // console.log(  "cred user id "+user.webauthnUserID)
    if (!user || !user.webauthn?.credentialID || !user.webauthnUserID) {
        console.log('User not registered with biometrics');
        return res.status(400).json({ message: 'User not registered with biometrics' });
    }

    // Generate authentication options
    console.log(5)
    //id
    console.log(typeof user.webauthn.credentialID)
    const bufferId =  base64url.toBuffer(user.webauthn.credentialID)
    const options = await libGenerateAuthenticationOptions({
        timeout: 60000,
        allowCredentials: [
            {
                id: user.webauthn.credentialID,
                type: 'public-key',
                transports: user.webauthn.transports || [],
            },
        ],
        userVerification: 'preferred',
        rpID,
    });
    console.log(6)

    // Store challenge for later verification
    user.challenge = options.challenge;
    await user.save();

    console.log("challangeeeeeeee " + user.challenge)
    // console.log(options)
    return res.json(options);
}


// 4. Verify Authentication Response
async function verifyAuthResponseHandler(req, res) {
    console.log(7)
    const userEmail = req.user?.userEmail;
    const body = req.body;
    const user = await User.findOne({ userEmail });

    if (!user || !user.webauthn?.credentialID || !user.webauthnUserID) {
        console.log("Bio dev not fou")
        return res.status(404).json({ message: 'Biometric device not found' });
    }

    console.log(8)
    let verification;
    try {
        console.log(typeof base64url.toBuffer(user.webauthn.credentialID))
        verification = await libVerifyAuthenticationResponse({
            response: body,
            expectedChallenge: user.challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            authenticator: {
                credentialID: base64url.toBuffer(user.webauthn.credentialID), // <-- FIXED
                credentialPublicKey: base64url.toBuffer(user.webauthn.publicKey),
                counter: user.webauthn.counter,
            },
        });
        console.log(9)
    } catch (err) {
        console.log("auth failed")
        return res.status(400).json({ message: 'Auth failed', error: err });
    }

    const { verified, authenticationInfo } = verification;

    if (verified) {
        user.webauthn.counter = authenticationInfo.newCounter;
        user.challenge = undefined;
        await user.save();
    }

    res.json({ success: verified });
}

module.exports = {
    generateRegistrationOptionsHandler,
    verifyRegistrationResponseHandler,
    generateAuthOptionsHandler,
    verifyAuthResponseHandler,
};