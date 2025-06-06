const express = require('express')
const {login,
        signUp,
        walletLogin,
        walletSignup,
        getNonce} = require('../controller/PublicController')


const router = express.Router();

router.post("/login", login)

router.post("/signup", signUp)

router.post("/walletSignup", walletSignup)

router.post("/walletLogin", walletLogin)

router.get("/nonce", getNonce)

module.exports = router;