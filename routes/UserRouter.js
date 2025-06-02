const express = require('express')
const {getUser} = require('../controller/UserController')


const router = express.Router();

router.get("/getProfile", getUser) //get profile

module.exports = router;