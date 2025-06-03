const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName : {
        type: String,
        required : true,
        unique : true,
    },
    userEmail : {
        type: String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'dev'], // Add as needed
        default: 'user'
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events',
    }]
})

const User = mongoose.model("User", userSchema);

module.exports = User;