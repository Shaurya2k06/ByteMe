const express = require('express');
const router = express.Router();
const {generateAuthOptionsHandler,
    generateRegistrationOptionsHandler,
    verifyAuthResponseHandler,
    verifyRegistrationResponseHandler } = require('../controller/biometricController');
const authMiddleware = require('../middlewares/auth');

router.post('/register/options', authMiddleware, generateRegistrationOptionsHandler);
router.post('/register/verify', authMiddleware, verifyRegistrationResponseHandler);
router.post('/auth/options', authMiddleware, generateAuthOptionsHandler);
router.post('/auth/verify', authMiddleware, verifyAuthResponseHandler);

module.exports = router;