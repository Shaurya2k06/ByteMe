const express = require('express')
const {getUser, getPurchaseHistory} = require('../controller/UserController')


const router = express.Router();

router.get("/getProfile", getUser) //get profile

router.get("/purchaseHistory", getPurchaseHistory);


module.exports = router;