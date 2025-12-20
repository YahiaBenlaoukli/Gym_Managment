import jwt from "jsonwebtoken";
import 'dotenv/config';

const authenticateToken = (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token." });
        }

        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

export default authenticateToken;
