const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
    eventLocation : {
        type : String,
        required : true,
    },
    eventDescription: {
        type: String,
        required: true,
    },
    eventDate: {
        type: Date,
        required: true,
    },
    eventPostedDate: {
        type: Date,
    },
    eventOrganiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amountToBePaid: {
        type: String, // e.g. "0.05 ETH" etc
        required: true,
    },
    eventImageUrl: {
        type: String,
        default: null,
    },
    tags: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true
});

const Events = mongoose.model("Events", eventSchema);

module.exports = Events;