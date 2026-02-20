import express from 'express';
import { createPaymentIntent, confirmPayment, checkPurchaseStatus, getMyOrders } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/check-status', protect, checkPurchaseStatus);
router.get('/my-orders', protect, getMyOrders);

export default router;
