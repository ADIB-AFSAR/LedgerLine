import express from 'express';
import { createPaymentIntent, confirmPayment, checkPurchaseStatus, getMyOrders, getAllOrders, getOrderById } from '../controllers/paymentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/check-status', protect, checkPurchaseStatus);
router.get('/my-orders', protect, getMyOrders);
router.get('/all', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrderById);

export default router;
