import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust the import according to your structure

export const Auth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (authorization) {
            const token = authorization.split(' ')[1]; // Correctly extract the token
            const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);
            const rootUser = await User.findOne({ _id: verifiedUser.id }).select('-password'); // Fixed typo from 'selet' to 'select'
            
            if (!rootUser) {
                return res.status(401).json({ message: "User not found" });
            }

            req.token = token;
            req.rootUser = rootUser;
            req.userId = rootUser._id; // Changed from req.usersId to req.userId for consistency
            next();
        } else {
            return res.status(401).json({ message: "Authorization header missing" });
        }
    } catch (err) {
        return res.status(401).json({ message: "Error while finding the Auth User", error: err.message });
    }
}

export const isAdmin = (req, res, next) => {
    try {
        if (req.rootUser && req.rootUser.isAdmin) { // Use logical && operator
            next();
        } else {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error while checking Admin", error: err.message });
    }
}
