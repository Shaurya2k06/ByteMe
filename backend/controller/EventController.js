const Events = require("../Model/Events");
const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const { verifyUserAuth } = require("../Service/authService");
const Event = require("../Model/Events");
require('dotenv').config();
const JWT_KEY = process.env.JWT_SECRET;


async function createEvent(req, res) {
    try {
        console.log(req)
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized, No token provided' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_KEY);

        const user = await User.findOne({userEmail : decoded.userEmail}).select('-password')
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const {
            eventName,
            eventLocation,
            eventDescription,
            eventDate,
            amountToBePaid,
            eventImageUrl,
            tags,
        } = req.body;


        if (!eventName || !eventLocation || !eventDescription || !eventDate || !amountToBePaid) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newEvent = new Events({
            eventName,
            eventLocation,
            eventDescription,
            eventDate : new Date(eventDate),
            eventPostedDate : new Date(),
            eventOrganiser: user._id,
            amountToBePaid,
            eventImageUrl,
            tags : tags || [],
        })

        const savedEvent = await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: savedEvent });
    } catch (post_Event_Error) {
        console.error('Error posting event:', post_Event_Error);
        res.status(500).json({ message: 'Internal Server Error', error: post_Event_Error.message });
    }
}

async function eventsRegistration(req, res) {
    try {
        const user = await verifyUserAuth(req);
        if(!user) res.status(404).json({message : 'User not found'})
        const eventId = req.body.eventId;
        const event = await Events.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (user.events.includes(eventId)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        user.events.push(eventId);
        await user.save();

        res.status(200).json({ message: 'Successfully registered for the event' });
    } catch (event_reg_error) {
        console.error('Register error:', event_reg_error);
        res.status(500).json({ message: 'Server error', error: event_reg_error.message });
    }
}

async function searchEvents(req, res) {
    try {
        const { query } = req.query;
        if (!query || query.trim() === '') {
            return res.status(400).json({ message: 'Search query cannot be empty' });
        }

        const regex = new RegExp(query, 'i');
        const now = new Date();

        const events = await Events.find({ eventDate: { $gte: now } })
            .populate('eventOrganiser', 'userName userEmail');

        const filteredEvents = events.filter(event =>
            regex.test(event.eventName) ||
            (Array.isArray(event.tags) && event.tags.some(tag => regex.test(tag))) ||
            (event.eventOrganiser && regex.test(event.eventOrganiser.userName))
        );

        return res.status(200).json(filteredEvents);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function getRegisteredEvent(req, res) {
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

        const now = new Date();
        const upcoming = user.events.filter(events => new Date(events.eventDate) >= now);

        return res.status(200).json({
           upcoming,
        });
    } catch (get_User_Error) {
        console.log(get_User_Error); //dp 1
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

async function getAllEvent(req, res) {
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

        const now = new Date();
        const upcoming = await Events.find({eventDate : { $gte: now }});

        return res.status(200).json(
            upcoming,
        );
    } catch (get_User_Error) {
        console.log(get_User_Error); //dp 1
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}



module.exports = {
    createEvent,
    eventsRegistration,
    searchEvents,
    getRegisteredEvent,
    getAllEvent
};
