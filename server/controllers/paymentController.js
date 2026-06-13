import crypto from 'crypto';
import asyncHandler from '../middlewares/asyncHandler.js';
import Purchase from '../models/Purchase.js';
import Plan from '../models/Plan.js';
import ITRForm from '../models/ITRForm.js';
import PendingPayment from '../models/PendingPayment.js';
import AppError from '../utils/AppError.js';
import { calculateOrderPricing } from '../utils/paymentPricing.js';
import { fulfillPurchaseFromOrder } from '../utils/fulfillPurchase.js';
import {
    createCashfreeOrder,
    verifyWebhookSignature,
} from '../services/cashfreeService.js';

const generateOrderId = (userId) =>
    `ll_${userId.toString().slice(-6)}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

const getClientUrl = () => process.env.CLIENT_URL || 'http://localhost:5173';
const getServerUrl = () => process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5001}`;

const normalizePhone = (phone, fallback = '9999999999') => {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.length === 10) return digits;
    if (digits.length > 10) return digits.slice(-10);
    return fallback;
};

// @desc      Create Cashfree Order
// @route     POST /api/v1/payments/create-order
// @access    Private
export const createOrder = asyncHandler(async (req, res, next) => {
    const {
        planId,
        serviceId,
        couponCode,
        referralCode,
        referralCoinsUsed = 0,
        cashbackCoinsUsed = 0,
    } = req.body;

    if (!planId) {
        return next(new AppError('Plan ID is required', 400));
    }

    const pricing = await calculateOrderPricing({
        planId,
        userId: req.user.id,
        couponCode,
        referralCoinsUsed,
        cashbackCoinsUsed,
    });

    const orderId = generateOrderId(req.user.id);
    const clientUrl = getClientUrl();
    const serverUrl = getServerUrl();

    const cashfreeOrder = await createCashfreeOrder({
        orderId,
        amount: pricing.finalAmountPaid,
        customer: {
            customerId: req.user.id.toString(),
            name: req.user.name,
            email: req.user.email || 'customer@powerfiling.com',
            phone: normalizePhone(req.user.mobile),
        },
        returnUrl: `${clientUrl}/payment-success?order_id={order_id}`,
        notifyUrl: `${serverUrl}/api/v1/payments/webhook`,
        orderNote: `Purchase: ${pricing.plan.name}`,
        orderTags: {
            planId: pricing.plan._id.toString(),
            userId: req.user.id.toString(),
        },
    });

    await PendingPayment.create({
        orderId,
        userId: req.user.id,
        planId: pricing.plan._id,
        serviceId: serviceId || null,
        planName: pricing.plan.name,
        planPrice: pricing.planPrice,
        referralCoinsUsed: pricing.referralCoinsUsed,
        cashbackCoinsUsed: pricing.cashbackCoinsUsed,
        coinDiscountApplied: pricing.coinDiscountApplied,
        couponCode: pricing.couponCode,
        couponDiscount: pricing.couponDiscount,
        referralCode: referralCode || null,
        finalAmountPaid: pricing.finalAmountPaid,
        status: 'pending',
    });

    res.status(200).json({
        success: true,
        orderId,
        paymentSessionId: cashfreeOrder.payment_session_id,
        cashfreeMode: process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox',
        finalPrice: pricing.finalAmountPaid,
        coinDiscount: pricing.coinDiscountApplied,
        couponDiscount: pricing.couponDiscount,
    });
});

// @desc      Confirm Payment (verify Cashfree order server-side)
// @route     POST /api/v1/payments/confirm
// @access    Private
export const confirmPayment = asyncHandler(async (req, res, next) => {
    const orderId = req.body.orderId || req.body.paymentIntentId;

    if (!orderId) {
        return next(new AppError('Order ID is required', 400));
    }

    // Dev mock bypass
    if (process.env.NODE_ENV !== 'production' && String(orderId).startsWith('mock_')) {
        const { planId, couponCode, referralCode, referralCoinsUsed = 0, cashbackCoinsUsed = 0, couponDiscount = 0 } = req.body;
        const existingPurchase = await Purchase.findOne({ paymentId: orderId });
        if (existingPurchase) {
            return res.status(200).json({
                success: true,
                message: 'Mock Payment already processed',
                purchaseId: existingPurchase._id,
            });
        }
        if (!planId) return next(new AppError('Plan ID is required for mock payment', 400));

        const plan = await Plan.findById(planId);
        const planPrice = plan?.price || 0;
        const actualCoinDiscount = Math.min((referralCoinsUsed || 0) + (cashbackCoinsUsed || 0), Math.floor(planPrice * 0.5));
        const actualCouponDiscount = couponDiscount || 0;
        const finalAmountPaid = Math.max(planPrice - actualCoinDiscount - actualCouponDiscount, 1);

        const purchase = await Purchase.create({
            userId: req.user.id,
            planId,
            planName: plan?.name || 'Tax Service',
            planPrice,
            paymentId: orderId,
            paymentStatus: 'Completed',
            formUnlocked: true,
            referralCoinsUsed: referralCoinsUsed || 0,
            cashbackCoinsUsed: cashbackCoinsUsed || 0,
            coinDiscountApplied: actualCoinDiscount,
            finalAmountPaid,
            couponDiscount: actualCouponDiscount,
            couponCode: couponCode || null,
            originalPrice: planPrice,
        });

        req.user.purchasedPlans.push(purchase._id);
        await req.user.save();

        return res.status(200).json({
            success: true,
            message: 'MOCK Payment confirmed successfully',
            purchaseId: purchase._id,
        });
    }

    const pending = await PendingPayment.findOne({ orderId, userId: req.user.id });
    if (!pending) {
        return next(new AppError('Payment session not found or unauthorized', 403));
    }

    try {
        const { purchase, alreadyProcessed, serviceId, planName } = await fulfillPurchaseFromOrder({
            orderId,
            userId: req.user.id,
        });

        res.status(200).json({
            success: true,
            message: alreadyProcessed ? 'Payment already processed' : 'Payment confirmed successfully',
            purchaseId: purchase._id,
            transactionId: orderId,
            serviceId,
            planName,
            paymentStatus: 'PAID',
        });
    } catch (err) {
        if (err instanceof AppError && err.statusCode === 400) {
            return res.status(400).json({
                success: false,
                message: err.message,
                transactionId: orderId,
                serviceId: pending.serviceId,
                planName: pending.planName,
            });
        }
        throw err;
    }
});

// @desc      Cashfree payment webhook
// @route     POST /api/v1/payments/webhook
// @access    Public (signature verified)
export const paymentWebhook = asyncHandler(async (req, res) => {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = req.rawBody;

    if (!verifyWebhookSignature(signature, rawBody, timestamp)) {
        return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
    }

    let payload;
    try {
        payload = JSON.parse(rawBody);
    } catch {
        return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    res.status(200).json({ success: true });

    const eventType = payload.type;
    if (eventType !== 'PAYMENT_SUCCESS_WEBHOOK') return;

    const orderId = payload?.data?.order?.order_id;
    const userId = payload?.data?.customer_details?.customer_id;

    if (!orderId || !userId) return;

    setImmediate(async () => {
        try {
            await fulfillPurchaseFromOrder({ orderId, userId });
        } catch (err) {
            console.error('[Webhook] Fulfillment failed:', err.message);
        }
    });
});

// @desc Check if user has active purchase for a plan
// @route GET /api/v1/payments/check-status
// @access Private
export const checkPurchaseStatus = asyncHandler(async (req, res, next) => {
    const { planId } = req.query;

    if (!planId) {
        return next(new AppError('Plan ID is required', 400));
    }

    const purchase = await Purchase.findOne({
        userId: req.user.id,
        planId: planId,
        paymentStatus: 'Completed',
    }).sort({ createdAt: -1 });

    if (!purchase) {
        return res.status(200).json({
            success: true,
            hasActivePlan: false,
        });
    }

    const itr = await ITRForm.findOne({ purchaseId: purchase._id });

    if (itr) {
        return res.status(200).json({
            success: true,
            hasActivePlan: false,
            isFiled: true,
        });
    }

    return res.status(200).json({
        success: true,
        hasActivePlan: true,
        purchaseId: purchase._id,
        isFiled: false,
    });
});

// @desc      Get My Orders (Purchases)
// @route     GET /api/v1/payments/my-orders
// @access    Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
    const purchases = await Purchase.find({ userId: req.user.id })
        .populate('planId')
        .sort({ createdAt: -1 });

    const ordersWithStatus = await Promise.all(
        purchases.map(async (purchase) => {
            let itrStatus = 'Pending Filing';
            let itrId = null;
            let submittedAt = null;
            let itrUpdatedAt = null;

            if (purchase.formUnlocked) {
                const itr = await ITRForm.findOne({ purchaseId: purchase._id });
                if (itr) {
                    itrStatus = itr.status || 'Submitted';
                    itrId = itr._id;
                    submittedAt = itr.submittedAt || itr.createdAt;
                    itrUpdatedAt = itr.updatedAt;
                }
            }

            const purchaseObj = purchase.toObject();

            return {
                ...purchaseObj,
                serviceName: purchase.planId?.name || purchase.planName || 'Tax Service',
                itrStatus,
                itrId,
                submittedAt,
                itrUpdatedAt,
            };
        })
    );

    res.status(200).json({
        success: true,
        count: ordersWithStatus.length,
        data: ordersWithStatus,
    });
});

// @desc      Get All Orders (Admin)
// @route     GET /api/v1/payments/all
// @access    Private (Admin)
export const getAllOrders = asyncHandler(async (req, res, next) => {
    const purchases = await Purchase.find()
        .populate('userId', 'name email mobile')
        .populate('planId')
        .sort({ createdAt: -1 });

    const ordersWithStatus = await Promise.all(
        purchases.map(async (purchase) => {
            let itrStatus = 'Pending Filing';
            let itrId = null;
            let submittedAt = null;
            let itrUpdatedAt = null;

            if (purchase.formUnlocked) {
                const itr = await ITRForm.findOne({ purchaseId: purchase._id });
                if (itr) {
                    itrStatus = itr.status || 'Submitted';
                    itrId = itr._id;
                    submittedAt = itr.submittedAt || itr.createdAt;
                    itrUpdatedAt = itr.updatedAt;
                }
            }

            const purchaseObj = purchase.toObject();

            return {
                ...purchaseObj,
                itrStatus,
                itrId,
                submittedAt,
                itrUpdatedAt,
            };
        })
    );

    res.status(200).json({
        success: true,
        count: ordersWithStatus.length,
        data: ordersWithStatus,
    });
});

// @desc      Get Order By ID
// @route     GET /api/v1/payments/:id
// @access    Private
export const getOrderById = asyncHandler(async (req, res, next) => {
    const purchase = await Purchase.findById(req.params.id)
        .populate('userId', 'name email mobile')
        .populate('planId');

    if (!purchase) {
        return next(new AppError('Order not found', 404));
    }

    const isAdminOrCA =
        req.user.role === 'admin' || (req.user.role === 'ca' && req.user.adminStatus === 'approved');
    if (!isAdminOrCA && purchase.userId?._id.toString() !== req.user.id.toString()) {
        return next(new AppError('Not authorized to view this order', 403));
    }

    let itrStatus = 'Pending Filing';
    let itrId = null;
    let submittedAt = null;
    let itrUpdatedAt = null;

    if (purchase.formUnlocked) {
        const itr = await ITRForm.findOne({ purchaseId: purchase._id });
        if (itr) {
            itrStatus = itr.status || 'Submitted';
            itrId = itr._id;
            submittedAt = itr.submittedAt || itr.createdAt;
            itrUpdatedAt = itr.updatedAt;
        }
    }

    const purchaseObj = purchase.toObject();

    res.status(200).json({
        success: true,
        data: {
            ...purchaseObj,
            serviceName: purchase.planId?.name || purchase.planName || 'Tax Service',
            itrStatus,
            itrId,
            submittedAt,
            itrUpdatedAt,
        },
    });
});
