import express from 'express';
import {
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    generateCode,
    validateCoupon
} from '../controllers/couponController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User route — validate coupon at checkout
router.post('/validate', protect, validateCoupon);

// Admin routes — CRUD
router.get('/generate-code', protect, authorize('admin'), generateCode);
router.get('/', protect, authorize('admin'), getCoupons);
router.get('/:id', protect, authorize('admin'), getCoupon);
router.post('/', protect, authorize('admin'), createCoupon);
router.put('/:id', protect, authorize('admin'), updateCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

export default router;