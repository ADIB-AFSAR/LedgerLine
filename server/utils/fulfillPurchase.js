import Purchase from '../models/Purchase.js';
import Plan from '../models/Plan.js';
import User from '../models/User.js';
import PendingPayment from '../models/PendingPayment.js';
import sendEmail from './sendEmail.js';
import { getInvoiceTemplate } from './emailTemplates.js';
import { creditCashbackCoins, creditReferralCoins, deductCoins } from '../controllers/referralController.js';
import { markCouponUsed } from '../controllers/couponController.js';
import { fetchCashfreeOrder, isOrderPaid, getOrderStatus, getPaymentOutcomeMessage } from '../services/cashfreeService.js';
import AppError from './AppError.js';

/**
 * Idempotent purchase fulfillment after Cashfree confirms payment.
 */
export const fulfillPurchaseFromOrder = async ({ orderId, userId }) => {
    const existingPurchase = await Purchase.findOne({ paymentId: orderId });
    if (existingPurchase) {
        return { purchase: existingPurchase, alreadyProcessed: true };
    }

    const pending = await PendingPayment.findOne({ orderId, userId });
    if (!pending) {
        throw new AppError('Payment session not found', 404);
    }

    if (pending.status === 'completed') {
        const purchase = await Purchase.findOne({ paymentId: orderId });
        if (purchase) return { purchase, alreadyProcessed: true };
    }

    const cashfreeOrder = await fetchCashfreeOrder(orderId);
    const orderStatus = getOrderStatus(cashfreeOrder);

    if (!isOrderPaid(cashfreeOrder)) {
        if (pending.status === 'pending') {
            pending.status = 'failed';
            await pending.save();
        }
        throw new AppError(getPaymentOutcomeMessage(orderStatus), 400);
    }

    const paidAmount = Number(cashfreeOrder.order_amount);
    if (Math.abs(paidAmount - pending.finalAmountPaid) > 0.01) {
        throw new AppError('Payment amount mismatch', 400);
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    const plan = await Plan.findById(pending.planId);

    const purchase = await Purchase.create({
        userId,
        planId: pending.planId,
        planName: pending.planName,
        planPrice: pending.planPrice,
        paymentId: orderId,
        paymentStatus: 'Completed',
        formUnlocked: true,
        coinDiscountApplied: pending.coinDiscountApplied,
        referralCoinsUsed: pending.referralCoinsUsed,
        cashbackCoinsUsed: pending.cashbackCoinsUsed,
        finalAmountPaid: pending.finalAmountPaid,
        couponCode: pending.couponCode,
        couponDiscount: pending.couponDiscount,
        originalPrice: pending.planPrice,
    });

    user.purchasedPlans.push(purchase._id);
    await user.save();

    pending.status = 'completed';
    await pending.save();

    setImmediate(async () => {
        try {
            if (pending.couponCode) {
                await markCouponUsed({ code: pending.couponCode, userId });
            }
            const totalCoins = pending.referralCoinsUsed + pending.cashbackCoinsUsed;
            if (totalCoins > 0) {
                await deductCoins({
                    userId,
                    coinsUsed: totalCoins,
                    coinType: 'separate',
                    referralCoinsUsed: pending.referralCoinsUsed,
                    cashbackCoinsUsed: pending.cashbackCoinsUsed,
                });
            }
            if (pending.referralCode && !user.referredBy && !user.referralRewardCredited) {
                const decodedId = Buffer.from(pending.referralCode, 'base64').toString('utf-8');
                if (/^[a-f\d]{24}$/i.test(decodedId) && decodedId !== userId.toString()) {
                    const buyer = await User.findById(userId);
                    buyer.referredBy = decodedId;
                    await buyer.save({ validateBeforeSave: false });
                }
            }
            await creditReferralCoins({ buyerUserId: userId, planName: pending.planName });
            await creditCashbackCoins({ buyerUserId: userId, planName: pending.planName });

            if (plan) {
                await sendEmail({
                    email: user.email,
                    subject: 'Payment Successful - Powerfiling Receipt',
                    message: `You have successfully purchased ${plan.name}. Transaction ID: ${orderId}`,
                    html: getInvoiceTemplate(user, purchase, plan),
                });
            }
        } catch (err) {
            console.error('[Payment] Non-critical post-payment task failed:', err);
        }
    });

    return { purchase, alreadyProcessed: false, serviceId: pending.serviceId, planName: pending.planName };
};
