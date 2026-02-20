import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return next(new AppError('User belonging to this token no longer exists.', 401));
            }

            next();
        } catch (error) {
            console.error(error);
            return next(new AppError('Not authorized, token failed', 401));
        }
    }

    if (!token) {
        return next(new AppError('Not authorized, no token', 401));
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(`User role ${req.user.role} is not authorized to access this route`, 403)
            );
        }
        next();
    };
};
