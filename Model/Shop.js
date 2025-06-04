const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName : {
        type : String,
        required : true,
    },
    itemDescription : {
        type : String,
        required : true,
    },
    itemOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    itemPrice: {
        type: String, // e.g. "0.05 ETH" etc
        required: true,
    },
    itemQuantity :{
        type :Number,
        required :true,
    },
    itemImages: [{
        data: Buffer,
        contentType: String,
    }]
}, {
    timestamps : true,
})


const Item = mongoose.model("Item", itemSchema);

module.exports = Item;