const express = require('express')
const {qrTokenCreation, qrTokenVerification} = require('../controller/QrController')

const router = express.Router();

router.get("/createQR", qrTokenCreation)

router.post("/verifyQR", qrTokenVerification)

module.exports = router;