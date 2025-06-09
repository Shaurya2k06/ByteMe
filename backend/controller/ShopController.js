const {verifyUserAuth} = require("../Service/authService");
const Item = require('../Model/Shop')
const Purchase = require("../Model/Purchase");
require('dotenv').config();

async function sellItem(req, res) {
    try {
        const user = await verifyUserAuth(req);
        if (!user) return res.status(404).json({ message: 'User not found' });


        const {itemName, itemDescription, itemPrice, itemQuantity, itemImages = [] } = req.body;
        if(!itemPrice || !itemName || !itemQuantity || !itemDescription) {
            return res.status(400).json({message : "Missing required fields"});
        }
        const imageBuffers = itemImages.map(img => ({
            data: Buffer.from(img.data, 'base64'),
            contentType: img.contentType,
        }));

        const newItem = new Item({
            itemName,
            itemDescription,
            itemPrice,
            itemQuantity,
            itemOwner: user._id,
            itemImages: imageBuffers,
        });

        await newItem.save();
        res.status(201).json({ message: 'Item listed successfully', item: newItem });
    } catch (item_posting_err) {
        console.error("Sell Item Error:", item_posting_err);
        res.status(500).json({ message: 'Server error', error: item_posting_err.message });
    }
}

async function getAllItems(req, res) {
    try {
        const user = await verifyUserAuth(req);
        if(!user) return res.status(404).json({message : "User not found"});

        const items = await Item.find().sort({ itemName : 1, itemPrice : 1});
        return res.status(200).json(items)
    } catch (err) {
        console.error("Get Item Error: ", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

async function searchItems(req, res) {
    try {
        const { query } = req.query;
        if (!query || query.trim() === '') {
            return res.status(400).json({ message: 'Search query cannot be empty' });
        }

        const regex = new RegExp(query, 'i');

        const items = await Item.find({ itemName: regex });

        return res.status(200).json(items);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function purchaseItem(req, res) {
    try {
        const user = await verifyUserAuth(req);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { itemId, quantity } = req.body;
        if (!itemId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid item ID or quantity' });
        }

        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.itemQuantity === 0) {
            return res.status(400).json({ message: 'Item Out Of Stock' });
        }

        if (item.itemQuantity < quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        item.itemQuantity -= quantity;
        await item.save();

        const purchase = new Purchase({
            user: user._id,
            item: item._id,
            quantity,
        });
        await purchase.save();

        return res.status(200).json({ message: 'Purchase successful', item });
    } catch (err) {
        console.error("Purchase Error:", err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

module.exports = {
    sellItem,
    getAllItems,
    searchItems,
    purchaseItem,
}