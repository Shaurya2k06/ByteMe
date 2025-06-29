const User = require('../Model/User')
const Event = require('../Model/Events')
const jwt = require('jsonwebtoken')
const {verifyUserAuth} = require("../Service/authService");
const Purchase = require("../Model/Purchase");
require('dotenv').config();
const JWT_KEY = process.env.JWT_SECRET;


async function getUser(req, res) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({message: 'Unauthorized, No token provided'});
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_KEY);

        const conditions = [];

        if (decoded.userEmail) conditions.push({ userEmail: decoded.userEmail });
        if (decoded.userName) conditions.push({ userName: decoded.userName });
        if (decoded.walletAddress) conditions.push({ walletAddress: decoded.walletAddress });

        if (conditions.length === 0) {
            return res.status(400).json({ message: 'Invalid token payload: no user identification found' });
        }

        const user = await User.findOne({ $or: conditions })
            .select('-password')
            .populate('events');

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const userId = user._id;
        const role = user.role;

        const now = new Date();
        const upcoming = user.events.filter(events => new Date(events.eventDate) >= now);
        const past = user.events.filter(events => new Date(events.eventDate) < now);
        const organisedEvents = await Event.find({eventOrganiser: userId});

        const baseResponse = {
            userDetails: {user},
            type: role,
        };

        if (role === 'user') {
            return res.status(200).json({
                ...baseResponse,
                registeredEvents: {upcoming, past},
            });
        } else if (role === 'admin') {
            return res.status(200).json({
                ...baseResponse,
                organisedEvents,
            });
        }

        return res.status(200).json({
                ...baseResponse,
                organisedEvents,
                registeredEvents: {upcoming, past},
            });
    } catch (get_User_Error) {
        console.log(get_User_Error); //dp 1
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

async function getPurchaseHistory(req, res) {
    try {
        const user = await verifyUserAuth(req);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const history = await Purchase.find({ user: user._id }).populate('item');
        return res.status(200).json({ history });
    } catch (err) {
        console.error("History Error:", err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

async function getAllStudents(req, res) {
    try {
        const user = await verifyUserAuth(req);
        if(!user) return res.status(404).json({message : "User not found"});

        const allStudents = await User.find({role : "dev"});
        if(!allStudents || allStudents.length === 0) return res.status(200).json({students: []});

        const studentsData = allStudents.map(student => ({
            userName: student.userName,
            walletAddress: student.walletAddress,
            feeStatus: student.feeStatus,
        }));

        console.log(studentsData)
        return res.status(200).json({ students: studentsData });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

async function setUserWallet(req, res) {
    console.log("abstract")
    try {
        const user = await verifyUserAuth(req);
        if (!user) return res.status(404).json({ message: 'Log-in to connect wallet' });
        const userId = user._id;
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }
        const existingUser = await User.findOne({ walletAddress: address, _id: { $ne: userId } });
        if (existingUser) {
            console.log('Wallet address already linked to another user')
            return res.status(409).json({ message: 'Wallet address already linked to another user' });
        }
        await User.findByIdAndUpdate(userId, { walletAddress: address });
        return res.status(200).json({ message: 'Wallet connected successfully' });
    }  catch (error) {
        console.error("Error connecting wallet:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    getUser,
    getPurchaseHistory,
    getAllStudents,
    setUserWallet
};