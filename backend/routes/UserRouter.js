const express = require('express')
const {getUser, getPurchaseHistory, getAllStudents, getEvents} = require('../controller/UserController')
const authorizedRoles = require('../middlewares/roleAuthenticator')

const router = express.Router();

router.get("/getProfile", getUser)

router.get("/purchaseHistory", getPurchaseHistory);

router.get("/allStudents", authorizedRoles("admin", "dev"), getAllStudents)

router.get("/getEvents", getEvents)

module.exports = router;