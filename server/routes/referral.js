import express from 'express';
import {
    getMyReferral,
    requestWithdrawal,
    getWithdrawalRequests,
    processWithdrawal,
    validateReferralCode,
    applyReferralCode,
    applyDiscountCoins
} from '../controllers/referralController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User routes (protected)
router.get('/me', protect, getMyReferral);
router.post('/validate', protect, validateReferralCode);
router.post('/apply', protect, applyReferralCode);
router.post('/withdraw', protect, requestWithdrawal);
router.post('/apply-discount', protect, applyDiscountCoins);

// Admin routes
router.get('/admin/withdrawals', protect, authorize('admin'), getWithdrawalRequests);
router.put('/admin/withdrawals/:userId/:requestId', protect, authorize('admin'), processWithdrawal);

export default router;