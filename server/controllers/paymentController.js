import Stripe from 'stripe';
import asyncHandler from '../middlewares/asyncHandler.js';
import Purchase from '../models/Purchase.js';
import Plan from '../models/Plan.js';
import ITRForm from '../models/ITRForm.js';
import AppError from '../utils/AppError.js';
import sendEmail from '../utils/sendEmail.js';
import { getInvoiceTemplate } from '../utils/emailTemplates.js';
import { creditCashbackCoins, creditReferralCoins, deductCoins  } from './referralController.js';
import { markCouponUsed } from './couponController.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc      Create Stripe Payment Intent
// @route     POST /api/v1/payments/create-intent
// @access    Private
export const createPaymentIntent = asyncHandler(async (req, res, next) => {
    const { planId, couponDiscount = 0, coinsToUse, referralCoinsUsed = 0, cashbackCoinsUsed = 0  } = req.body;
    console.log('Creating Intent for PlanId:', planId);

    const plan = await Plan.findById(planId);

    if (!plan) {
        return next(new AppError('Plan not found', 404));
    }
    

    // Calculate discounted amount
    const coinDiscount = referralCoinsUsed + cashbackCoinsUsed;
    const totalDiscount = referralCoinsUsed + cashbackCoinsUsed;
    const maxDiscount = Math.floor(plan.price * 0.5);
    const discount = Math.min(totalDiscount, maxDiscount);
    const finalPrice = Math.max(plan.price - discount, 1); // minimum ₹1

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: finalPrice * 100, // amount in smallest currency unit (cents/paise)
            currency: 'inr', // Stripe usually handles currency by account, but 'inr' is good for India.
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                planId: plan._id.toString(),
                userId: req.user._id.toString(),
                coinsUsed: discount,
                couponDiscount: discount,
                originalPrice: plan.price
            },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            discount,
            finalPrice,
        });
    } catch (error) {
        console.error(error);
        return next(new AppError('Payment gateway error: ' + error.message, 500));
    }
});

// @desc      Confirm Payment (Verify Intent Status)
// @route     POST /api/v1/payments/confirm
// @access    Private
export const confirmPayment = asyncHandler(async (req, res, next) => {
    const { paymentIntentId, planId, couponDiscount, couponCode, referralCode, coinsUsed, coinType, referralCoinsUsed, cashbackCoinsUsed } = req.body;
    console.log(req.body)
    if (!paymentIntentId) {
        return next(new AppError('Payment Intent ID is required', 400));
    }

    // --- MOCK BYPASS ---
    if (process.env.NODE_ENV !== 'production' && paymentIntentId.startsWith('mock_')) {
        const existingPurchase = await Purchase.findOne({ paymentId: paymentIntentId });
        if (existingPurchase) {
            return res.status(200).json({
                success: true,
                message: 'Mock Payment already processed',
                purchaseId: existingPurchase._id
            });
        }

        if (!planId) return next(new AppError('Plan ID is required for mock payment', 400));

        const plan = await Plan.findById(planId);

        const planPrice = plan?.price || 0;
        const actualCoinDiscount = Math.min((referralCoinsUsed || 0) + (cashbackCoinsUsed || 0), Math.floor(planPrice * 0.5));
        const actualCouponDiscount = couponDiscount || 0;
        const finalAmountPaid = Math.max(planPrice - actualCoinDiscount - actualCouponDiscount, 0);

        const purchase = await Purchase.create({
            userId: req.user.id,
            planId,
            planName: plan?.name || 'Tax Service',
            planPrice: plan?.price || 0,
            paymentId: paymentIntentId,
            paymentStatus: 'Completed',
            formUnlocked: true,
            referralCoinsUsed: referralCoinsUsed || 0,
            cashbackCoinsUsed: cashbackCoinsUsed || 0,
            coinDiscountApplied: actualCoinDiscount,
            finalAmountPaid,
            couponDiscount: actualCouponDiscount,  
            couponCode: couponCode || null,        
            originalPrice: plan?.price || 0
        });

        req.user.purchasedPlans.push(purchase._id);
        await req.user.save();
        console.log('Mock purchase created:', purchase);

        // ── SEND RESPONSE IMMEDIATELY ──
        res.status(200).json({
            success: true,
            message: 'MOCK Payment confirmed successfully',
            purchaseId: purchase._id
        });

        // ── NON-CRITICAL TASKS ──
        try {
            if (couponCode) {
        await markCouponUsed({ code: couponCode, userId: req.user.id });
    }
            if (coinsUsed && coinsUsed > 0) {
                await deductCoins({
                    userId: req.user.id,
                    coinsUsed,
                    coinType: coinType || 'both',
                    referralCoinsUsed: referralCoinsUsed || 0,
                    cashbackCoinsUsed: cashbackCoinsUsed || 0
                });
            }
            console.log('Coins deducted for mock payment');
            if (referralCode && !req.user.referredBy && !req.user.referralRewardCredited) {
                const decodedId = Buffer.from(referralCode, 'base64').toString('utf-8');
                if (/^[a-f\d]{24}$/i.test(decodedId) && decodedId !== req.user.id.toString()) {
                    const buyer = await User.findById(req.user.id);
                    buyer.referredBy = decodedId;
                    await buyer.save({ validateBeforeSave: false });
                }
            }

            await creditReferralCoins({ buyerUserId: req.user.id, planName: plan?.name || '' });
            console.log('Referral coins credited for mock payment');
            await creditCashbackCoins({ buyerUserId: req.user.id, planName: plan?.name || '' });
            console.log('cashback credited for mock payment');
            if (plan) {
                await sendEmail({
                    email: req.user.email,
                    subject: 'Payment Successful - Powerfiling Receipt',
                    message: `You have successfully purchased ${plan.name}. Transaction ID: ${paymentIntentId}`,
                    html: getInvoiceTemplate(req.user, purchase, plan)
                });
                consoel.log('Email sent for mock payment');
            }
        } catch (nonCriticalErr) {
            console.error('[Payment] Non-critical post-payment task failed (mock):', nonCriticalErr);
        }

        return; // ← CRITICAL: stops execution, prevents falling into Stripe section
    }
    // --- END MOCK ---

    // --- REAL STRIPE PAYMENT ---
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            const existingPurchase = await Purchase.findOne({ paymentId: paymentIntentId });
            if (existingPurchase) {
                return res.status(200).json({
                    success: true,
                    message: 'Payment already processed',
                    purchaseId: existingPurchase._id
                });
            }

            const plan = await Plan.findById(planId || paymentIntent.metadata.planId);

            const planPrice = plan?.price || 0;
            const actualCoinDiscount = Math.min((referralCoinsUsed || 0) + (cashbackCoinsUsed || 0), Math.floor(planPrice * 0.5));
            const actualCouponDiscount = couponDiscount || 0;
            const finalAmountPaid = Math.max(planPrice - actualCoinDiscount - actualCouponDiscount, 0);

            const purchase = await Purchase.create({
                userId: req.user.id,
                planId: planId || paymentIntent.metadata.planId,
                planName: plan?.name || 'Tax Service',
                planPrice: plan?.price || 0,
                paymentId: paymentIntentId,
                paymentStatus: 'Completed',
                formUnlocked: true,
                coinDiscountApplied: actualCoinDiscount,
                referralCoinsUsed: referralCoinsUsed || 0,
                cashbackCoinsUsed: cashbackCoinsUsed || 0,
                finalAmountPaid,
                couponCode: couponCode || null,
                couponDiscount: actualCouponDiscount,
                originalPrice: plan?.price || 0
            });

            req.user.purchasedPlans.push(purchase._id);
            await req.user.save();
            console.log('Purchase created:', purchase);

            // ── SEND RESPONSE IMMEDIATELY ──
            res.status(200).json({
                success: true,
                message: 'Payment confirmed successfully',
                purchaseId: purchase._id
            });

            // ── NON-CRITICAL TASKS ──
            try {
                if (couponCode) {
        await markCouponUsed({ code: couponCode, userId: req.user.id });
    }
                if (coinsUsed && coinsUsed > 0) {
                    await deductCoins({
                        userId: req.user.id,
                        coinsUsed,
                        coinType: coinType || 'both',
                        referralCoinsUsed: referralCoinsUsed || 0,
                        cashbackCoinsUsed: cashbackCoinsUsed || 0
                    });
                    console.log('Coins deducted');
                }

                if (referralCode && !req.user.referredBy && !req.user.referralRewardCredited) {
                    const decodedId = Buffer.from(referralCode, 'base64').toString('utf-8');
                    if (/^[a-f\d]{24}$/i.test(decodedId) && decodedId !== req.user.id.toString()) {
                        const buyer = await User.findById(req.user.id);
                        buyer.referredBy = decodedId;
                        await buyer.save({ validateBeforeSave: false });
                    }
                }

                await creditReferralCoins({ buyerUserId: req.user.id, planName: plan?.name || '' });
                console.log('Referral coins credited');
                await creditCashbackCoins({ buyerUserId: req.user.id, planName: plan?.name || '' });
                console.log('cashback credited');

                const planForEmail = await Plan.findById(purchase.planId);
                if (planForEmail) {
                    await sendEmail({
                        email: req.user.email,
                        subject: 'Payment Successful - Powerfiling Receipt',
                        message: `You have successfully purchased ${planForEmail.name}. Transaction ID: ${paymentIntentId}`,
                        html: getInvoiceTemplate(req.user, purchase, planForEmail)
                    });
                    console.log('Email sent');
                }
            } catch (nonCriticalErr) {
                console.error('[Payment] Non-critical post-payment task failed:', nonCriticalErr);
            }

        } else {
            return next(new AppError(`Payment not successful. Status: ${paymentIntent.status}`, 400));
        }
    } catch (error) {
        console.error(error);
        return next(new AppError('Payment confirmation failed: ' + error.message, 500));
    }
});

// @desc Check if user has active purchase for a plan
// @route GET /api/v1/payments/check-status
// @access Private
export const checkPurchaseStatus = asyncHandler(async (req, res, next) => {
    const { planId } = req.query;

    if (!planId) {
        return next(new AppError('Plan ID is required', 400));
    }

    // Find latest completed purchase for this plan
    const purchase = await Purchase.findOne({
        userId: req.user.id,
        planId: planId,
        paymentStatus: 'Completed'
    }).sort({ createdAt: -1 });

    if (!purchase) {
        return res.status(200).json({
            success: true,
            hasActivePlan: false
        });
    }

    // Check if ITR is already filed for this purchase
    const itr = await ITRForm.findOne({ purchaseId: purchase._id });

    if (itr) {
        // ITR already filed, so this purchase is "consumed"
        return res.status(200).json({
            success: true,
            hasActivePlan: false,
            isFiled: true
        });
    }

    return res.status(200).json({
        success: true,
        hasActivePlan: true,
        purchaseId: purchase._id,
        isFiled: false
    });
});

// @desc      Get My Orders (Purchases)
// @route     GET /api/v1/payments/my-orders
// @access    Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
    // 1. Fetch all user purchases, verify auth user matches userId
    const purchases = await Purchase.find({ userId: req.user.id })
        .populate('planId')
        .sort({ createdAt: -1 });

    // 2. Map and add ITR Status
    const ordersWithStatus = await Promise.all(purchases.map(async (purchase) => {
        // Check ITR Status if formUnlocked
        let itrStatus = 'Pending Filing';
        let itrId = null;
        let submittedAt = null;
        let itrUpdatedAt = null;

        if (purchase.formUnlocked) {
            const itr = await ITRForm.findOne({ purchaseId: purchase._id });
            if (itr) {
                itrStatus = itr.status || 'Submitted'; // Or fetch specific status from ITR
                itrId = itr._id;
                submittedAt = itr.submittedAt || itr.createdAt;
                itrUpdatedAt = itr.updatedAt;
            }
        }

        // Convert to plain object to attach properties
        const purchaseObj = purchase.toObject();

        return {
            ...purchaseObj,
            serviceName: purchase.planId?.name || purchase.planName || 'Tax Service',
            itrStatus,
            itrId,
            submittedAt,
            itrUpdatedAt
        };
    }));

    res.status(200).json({
        success: true,
        count: ordersWithStatus.length,
        data: ordersWithStatus
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

    const ordersWithStatus = await Promise.all(purchases.map(async (purchase) => {
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
            itrUpdatedAt
        };
    }));

    res.status(200).json({
        success: true,
        count: ordersWithStatus.length,
        data: ordersWithStatus
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

    // Authorization check: Admin/CA can see any, regular user only their own
    const isAdminOrCA = req.user.role === 'admin' || (req.user.role === 'ca' && req.user.adminStatus === 'approved');
    if (!isAdminOrCA && purchase.userId?._id.toString() !== req.user.id.toString()) {
        return next(new AppError('Not authorized to view this order', 403));
    }

    // Get ITR status
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
            itrUpdatedAt
        }
    });
});
