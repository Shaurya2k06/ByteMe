const express = require('express')
const {getUser, getPurchaseHistory, getAllStudents} = require('../controller/UserController')
const authorizedRoles = require('../middlewares/roleAuthenticator')

const router = express.Router();

router.get("/getProfile", getUser)

router.get("/purchaseHistory", getPurchaseHistory);

router.get("/allStudents", authorizedRoles("admin", "dev"), getAllStudents)

module.exports = router;