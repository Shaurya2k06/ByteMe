const {verifyUserAuth} = require('../Service/authService')


const authorizedRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        const user = await verifyUserAuth(req);
        try {
            if (!user || !allowedRoles.includes(user.role)) {
                return res.status(403).json({message: 'Forbidden: Access denied'});
            }
            next();
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: 'Server error'});
        }
    };
};

module.exports = authorizedRoles;