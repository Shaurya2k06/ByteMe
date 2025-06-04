const express = require('express')
const {login,
        signUp,
        walletLogin,
        walletSignup} = require('../controller/PublicController')


const router = express.Router();

router.post("/login", login)

router.post("/signup", signUp)

router.post("/walletSignup", walletSignup)

router.post("/walletLogin", walletLogin)

module.exports = router;