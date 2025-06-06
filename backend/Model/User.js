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
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'dev'],
        default: 'user'
    },
    walletAddress: {
        type: String,
        unique: true,
        sparse: true
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events',
    }],
    feeStatus : {
        type : Boolean,
        default: false,
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;