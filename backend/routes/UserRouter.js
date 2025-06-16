const express = require('express')
const { getUser, getPurchaseHistory, getAllStudents, setUserWallet } = require('../controller/UserController')
const authorizedRoles = require('../middlewares/roleAuthenticator')
const { verifyUserAuth } = require('../Service/authService');

const router = express.Router();

router.get("/getProfile", getUser)

router.get("/purchaseHistory", getPurchaseHistory);

router.get("/allStudents", authorizedRoles("admin", "dev"), getAllStudents)

router.patch("/updateWallet", setUserWallet)

//getMe Route for authContext in the frontend
router.get("/getMe", async (req, res) => {
  try {
    const user = await verifyUserAuth(req);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user }); // ✅ This ensures .data.user is available
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = router;

module.exports = router;