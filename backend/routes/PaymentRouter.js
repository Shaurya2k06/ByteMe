const express = require('express');
const {feePayment} = require('../controller/PaymentController')

const router = express.Router();

router.post("/pay-fee", feePayment);

module.exports = router;