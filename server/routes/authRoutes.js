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
    verifyMobileOTP,
    requestAdminAccess,
    getAdminRequests,
    handleAdminRequest,
    firebaseLogin,
    firebaseVerifyMobile,
    checkUser,
    deleteUser
} from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/firebase-login', firebaseLogin);
router.post('/verify-mobile-firebase', protect, firebaseVerifyMobile);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Mobile Verification (Protected: User Must Have Token first)
router.post('/send-mobile-otp', protect, sendMobileOTP);
router.post('/verify-mobile-otp', protect, verifyMobileOTP);
router.post('/check-user', checkUser);

router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Admin Access Management
router.post('/request-admin', protect, requestAdminAccess);
router.get('/admin-requests', protect, authorize('admin'), getAdminRequests);
router.put('/admin-requests/:id', protect, authorize('admin'), handleAdminRequest);

// Google Auth Routes
router.get(
    '/google',
    (req, res, next) => {
        const intent = req.query.state || ''; // Capturing 'admin' or other intent
        
        // Capture the frontend URL from referer so we know where to redirect back to
        const referer = req.headers.referer || req.headers.origin || '';
        let clientUrl = '';
        if (referer) {
            try {
                clientUrl = new URL(referer).origin;
            } catch (e) {
                clientUrl = '';
            }
        }

        const stateObj = {
            intent: intent,
            clientUrl: clientUrl
        };
        const customState = Buffer.from(JSON.stringify(stateObj)).toString('base64');

        passport.authenticate('google', { 
            scope: ['profile', 'email'],
            state: customState 
        })(req, res, next);
    }
);

router.get(
    '/google/callback',
    (req, res, next) => {
        const { state } = req.query;
        passport.authenticate('google', { 
            session: false, 
            failureRedirect: '/login',
            state: state
        })(req, res, next);
    },
    googleCallback
);

export default router;
