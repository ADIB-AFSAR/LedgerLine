import express from 'express';
import {
    createOrder,
    confirmPayment,
    checkPurchaseStatus,
    getMyOrders,
    getAllOrders,
    getOrderById,
    getOrderSharedDocuments,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/create-intent', protect, createOrder); // legacy alias
router.post('/confirm', protect, confirmPayment);
router.get('/check-status', protect, checkPurchaseStatus);
router.get('/my-orders', protect, getMyOrders);
router.get('/all', protect, authorize('admin'), getAllOrders);
router.get('/:id/shared-documents', protect, getOrderSharedDocuments);
router.get('/:id', protect, getOrderById);

export default router;
