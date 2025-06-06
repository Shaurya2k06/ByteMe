const jwt = require("jsonwebtoken");
const User = require("../Model/User");
require("dotenv").config();

const JWT_KEY = process.env.JWT_SECRET;

async function verifyUserAuth(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized, No token provided');
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_KEY);

    const conditions = [];

    if (decoded.userEmail) conditions.push({ userEmail: decoded.userEmail });
    if (decoded.userName) conditions.push({ userName: decoded.userName });
    if (decoded.walletAddress) conditions.push({ walletAddress: decoded.walletAddress });


    if (conditions.length === 0) {
        throw new Error('Invalid token payload: no user identification found');
    }
    const user = await User.findOne({ $or: conditions });
    return user;
}

module.exports = { verifyUserAuth };