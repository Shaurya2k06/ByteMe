const express = require('express')
const {getUser, getPurchaseHistory, getAllStudents, setUserWallet} = require('../controller/UserController')
const authorizedRoles = require('../middlewares/roleAuthenticator')

const router = express.Router();

router.get("/getProfile", getUser)

router.get("/purchaseHistory", getPurchaseHistory);

router.get("/allStudents", authorizedRoles("admin", "dev"), getAllStudents)

router.patch("/updateWallet", setUserWallet)

module.exports = router;