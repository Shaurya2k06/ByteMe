const jwt = require("jsonwebtoken");
const User = require("../Model/User");
require("dotenv").config();

const JWT_KEY = process.env.JWT_SECRET;

async function verifyUserAuth(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauthorized, No token provided'});
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_KEY);
    const user = await User.findOne({ userEmail: decoded.userEmail });
    return user;
}

module.exports = { verifyUserAuth };