import Plan from '../models/Plan.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';
import AppError from './AppError.js';

const MAX_COIN_DISCOUNT_RATIO = 0.5;

/**
 * Server-side pricing — never trust client-sent amounts.
 */
export const calculateOrderPricing = async ({
    planId,
    userId,
    couponCode,
    referralCoinsUsed = 0,
    cashbackCoinsUsed = 0,
}) => {
    const plan = await Plan.findById(planId);
    if (!plan) {
        throw new AppError('Plan not found', 404);
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    const maxCoinDiscount = Math.floor(plan.price * MAX_COIN_DISCOUNT_RATIO);
    const requestedCoinDiscount = (referralCoinsUsed || 0) + (cashbackCoinsUsed || 0);

    if (referralCoinsUsed > (user.coins || 0)) {
        throw new AppError('Insufficient referral coins', 400);
    }
    if (cashbackCoinsUsed > (user.cashbackCoins || 0)) {
        throw new AppError('Insufficient cashback coins', 400);
    }
    if (requestedCoinDiscount > maxCoinDiscount) {
        throw new AppError('Coin discount cannot exceed 50% of plan price', 400);
    }

    let couponDiscount = 0;
    let validatedCouponCode = null;

    if (couponCode?.trim()) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
        if (!coupon) throw new AppError('Invalid coupon code', 400);
        if (!coupon.isActive) throw new AppError('This coupon is no longer active', 400);
        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            throw new AppError('This coupon has expired', 400);
        }
        const alreadyUsed = coupon.usedBy.some((u) => u.userId.toString() === userId.toString());
        if (alreadyUsed) throw new AppError('You have already used this coupon', 400);

        couponDiscount = coupon.discountAmount;
        validatedCouponCode = coupon.code;
    }

    const coinDiscountApplied = Math.min(requestedCoinDiscount, maxCoinDiscount);
    const finalAmountPaid = Math.max(plan.price - coinDiscountApplied - couponDiscount, 1);

    return {
        plan,
        user,
        planPrice: plan.price,
        referralCoinsUsed: referralCoinsUsed || 0,
        cashbackCoinsUsed: cashbackCoinsUsed || 0,
        coinDiscountApplied,
        couponDiscount,
        couponCode: validatedCouponCode,
        finalAmountPaid,
        totalCoinDiscount: coinDiscountApplied,
    };
};
