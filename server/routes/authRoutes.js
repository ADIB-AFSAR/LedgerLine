import express from 'express';
import {
    register,
    login,
    getMe,
    googleCallback,
    getUsers,
    verifyOTP,
    resendOTP,
    sendMobileOTP,
    verifyMobileOTP
} from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Mobile Verification (Protected: User Must Have Token first)
router.post('/send-mobile-otp', protect, sendMobileOTP);
router.post('/verify-mobile-otp', protect, verifyMobileOTP);

router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);

// Google Auth Routes
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleCallback
);

export default router;
