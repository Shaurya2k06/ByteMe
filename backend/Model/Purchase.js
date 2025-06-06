const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    purchasedAt: {
        type: Date,
        default: Date.now,
    }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;