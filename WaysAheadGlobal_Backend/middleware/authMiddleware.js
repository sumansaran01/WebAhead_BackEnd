const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authToken = req.header("Authorization");
        if (!authToken) {
            return res.status(401).json({ error: "Access Denied. No token provided." });
        }

        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        req.user = decoded.user;

        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid Token." });
    }
};

// Middleware to check if the user is an admin
const adminMiddleware = (req, res, next) => {
    if (req.user.email === "suman.saran@gmail.com" || req.user.email === "saransuman1757@gmail.com") {
        next();
    } else {
        return res.status(403).json({ error: "Access Denied. Admins only." });
    }
};

module.exports = { authMiddleware, adminMiddleware };
