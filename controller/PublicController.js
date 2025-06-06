const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_KEY = process.env.JWT_SECRET;
const  ethers  = require('ethers');


async function signUp(req, res) {
    console.log("yayyy")
    try {
        const body = req.body;
        if(!body || !body.userName || !body.userEmail || !body.password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const userInDb = await User.findOne({
            $or: [
                { userEmail: body.userEmail },
                { userName: body.userName }
            ]
        });
        if(userInDb) {
            return res.status(409).json({ warning: "Email or username already exists" });
        }

        const hashedPass = await bcrypt.hash(body.password, 10); //10 is the salting
        const newUser = await User.create({
            userName : body.userName,
            userEmail : body.userEmail,
            password : hashedPass,
            role : body.role,
        })

        const token = jwt.sign(
            { userEmail: newUser.userEmail, userName: newUser.userName, role : newUser.role },
            JWT_KEY,
            { expiresIn: '1d' }
        );

        return res.status(201).json({message: "User SignUp Sucessful",
            username : body.userName,
            role : body.role,
            token : token,
        });
    } catch (signup_error) {
        console.log(signup_error);
        return res.status(500).json({status: "Something went wrong, please try again later."})
    }
}


async function login(req, res) {
    try {
        const body = req.body;
        console.log("login in")
        console.log(body)
        console.log(body.userName + " " + body.username)
        console.log(body.password + " " + body.password)
        if(!body.userName || !body.password) {
            return res.status(400).json({ message: 'All fields are required' });
            console.log("All fields whatever")
        }
        console.log("stage 1")
        const userInDb = await User.findOne({
            userName: body.userName,
        });
        if(!userInDb) {
            return res.status(400).json({ message: 'Invalid Username' });
            console.log("UserName Invalid")
        }

        const isPasswordValid = await bcrypt.compare(body.password, userInDb.password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Password' });
            console.log("Invalid Pass")
        }

        const token = jwt.sign({
            userName : userInDb.userName,
            userEmail: userInDb.userEmail,
            role : userInDb.role,
        },
            JWT_KEY,
            {expiresIn: "1d"}
        );
        return res.status(200).json({
            message: 'Login successful',
            username: userInDb.userName,
            token: token,
            role : userInDb.role,
        });
    } catch (login_err) {
        console.error(login_err);
        return res.status(500).json({ message: 'Something went wrong during login' });
    }
}


async function walletLogin(req, res) {
    try {
        const { walletAddress, signature } = req.body;

        if (!walletAddress || !signature) {
            return res.status(400).json({ message: "Missing wallet address or signature" });
        }

        const nonce = nonceMap.get(walletAddress.toLowerCase());
        if (!nonce) {
            return res.status(401).json({ message: "Nonce not found or expired" });
        }

        const expectedMessage = `Sign this message to login: ${nonce}`;
        const recoveredAddress = ethers.verifyMessage(expectedMessage, signature);

        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(401).json({ message: "Invalid signature" });
        }

        // Clear nonce after use to prevent replay
        nonceMap.delete(walletAddress.toLowerCase());

        let user = await User.findOne({ walletAddress });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = jwt.sign(
            { userName: user.userName, walletAddress: user.walletAddress, role: user.role },
            JWT_KEY,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: "Wallet login successful",
            token,
            username: user.userName,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Login failed" });
    }
}


async function walletSignup(req, res) {
    try {
        const { userName, userEmail, role, walletAddress, signature, nonce } = req.body;

        if (!userName || !userEmail || !walletAddress || !signature || !nonce || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await User.findOne({
            $or: [
                { userName },
                { userEmail },
                { walletAddress: walletAddress.toLowerCase() }
            ]
        });

        if (existing) {
            return res.status(409).json({ message: "Username, email or wallet already exists" });
        }

        // Verify wallet signature
        const expectedMessage = `Sign this message to register: ${nonce}`;
        const recovered = ethers.verifyMessage(expectedMessage, signature);

        if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(401).json({ message: "Invalid wallet signature" });
        }


        const newUser = await User.create({
            userName,
            userEmail,
            walletAddress: walletAddress.toLowerCase(),
            role: "user"
        });

        const token = jwt.sign(
            { userName: newUser.userName, userEmail: newUser.userEmail, walletAddress: newUser.walletAddress, role: newUser.role },
            JWT_KEY,
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            message: "Signup successful",
            token,
            username: newUser.userName,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Wallet signup failed" });
    }
}


//nonce thingy
const nonceMap = new Map(); // Replace with Redis or DB in production

function generateNonce() {
    return crypto.randomUUID();
}

async function getNonce(req, res) {
    const { walletAddress } = req.params;

    if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
    }

    const nonce = generateNonce();
    nonceMap.set(walletAddress.toLowerCase(), nonce);

    return res.status(200).json({ nonce });
}


module.exports = {
    signUp,
    login,
    walletSignup,
    walletLogin,
    getNonce
};