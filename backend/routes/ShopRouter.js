const { getAllItems, sellItem, searchItems, purchaseItem } = require('../controller/ShopController')
const authorizedRoles = require('../middlewares/roleAuthenticator')
const express = require("express");

const router = express.Router();

router.post("/createItem", authorizedRoles("admin", "user", "dev"), sellItem);

router.get("/getItems", getAllItems);

router.get("/search", searchItems);

router.post("/purchaseItem", purchaseItem);


module.exports = router;