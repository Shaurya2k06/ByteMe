const jwt = require('jsonwebtoken')
const User = require("../Model/User");
require('dotenv').config();
const TOKENIZING_KEY = process.env.TOKENIZING_KEY;
const {verifyUserAuth} = require("../Service/authService");


async function qrTokenCreation(req, res) {
    try {
        const user = await verifyUserAuth(req);
        if(!user) {
            return res.status(401).json({message : "No user found"});
        }
        const {userName, walletAddress} = user;
        if(!userName || !walletAddress) {
            return res.status(400).json({message : "Please sign in or connect your wallet"});
        }
        const qrToken = jwt.sign({
            userName, walletAddress
        }, TOKENIZING_KEY, {
            expiresIn : "30d"
        })
        user.qrToken = qrToken;
        await user.save();

        return res.status(201).json({message :"QR Token Created Successfully", qrToken});
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: "Something went wrong, please try again later."})
    }
}

async function qrTokenVerification(req, res) {
    try {
        const body = req.body;
        const user = await verifyUserAuth(req);
        if(!user) {
            return res.status(401).json({message : "No user found"});
        }
        const token = body.qrToken;
        if(!token) return res.status(401).json({message : "No Token Found"});

        let decodedQrToken;
        try {
            decodedQrToken = jwt.verify(token, TOKENIZING_KEY);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or Expired Token" });
        }
        const {userName, walletAddress} = decodedQrToken;
        const receiverUser = await User.findOne({
            userName: decodedQrToken.userName,
            walletAddress: decodedQrToken.walletAddress,
            qrToken : token
        }).lean();
        if(!receiverUser) {
            res.status(401).json({message : "QR Expired or Invalid Token"})
        }
        return res.status(200).json({message : "Token Verified Successfully",
                receiverWalletAddress : walletAddress,
                receiverUserName : userName,
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: "Something went wrong, please try again later."})
    }
}

module.exports = {
    qrTokenCreation,
    qrTokenVerification
}