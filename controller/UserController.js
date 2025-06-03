const User = require('../Model/User')
const Event = require('../Model/Events')
const jwt = require('jsonwebtoken')
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

        const user = await User.findOne({userEmail: decoded.userEmail})
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

module.exports = {
    getUser
};