const {verifyUserAuth} = require("../Service/authService");


async function feePayment(req, res) {
    try {
        const user = await verifyUserAuth(req);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.feeStatus === true)
            return res.status(200).json({ message: "Fee already paid" });

        user.feeStatus = true;
        await user.save();

        return res.status(200).json({ message: "Fee payment successful" });
    } catch (err) {
        console.error("Fee payment error:", err);
        return res.status(500).json({ message: "Server error during payment" });
    }
}

module.exports = {
    feePayment,
}