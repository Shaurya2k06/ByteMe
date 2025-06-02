const User = require('../Model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const JWT_KEY = process.env.JWT_SECRET;


async function getUser(req, res) {
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader.split(' '))
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized, No token provided' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_KEY);

        const user = await User.findOne({userEmail : decoded.userEmail}).select('-password')
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (get_User_Error) {
        console.log(get_User_Error); //dp 1
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = {
    getUser
};