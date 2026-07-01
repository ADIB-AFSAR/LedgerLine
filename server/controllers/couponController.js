import asyncHandler from '../middlewares/asyncHandler.js';
import Coupon from '../models/Coupon.js';
import Plan from '../models/Plan.js';
import AppError from '../utils/AppError.js';

// ── Helper: compute discount for a coupon against a plan price ────────────────
const computeDiscount = (coupon, planPrice) => {
    let raw = coupon.discountType === 'percentage'
        ? Math.floor(planPrice * (coupon.discountPercent / 100))
        : coupon.discountAmount;

    if (coupon.discountType === 'percentage' && coupon.maxPercentDiscount) {
        raw = Math.min(raw, coupon.maxPercentDiscount);
    }
    return Math.max(raw, 0);
};

const isPlanApplicable = (coupon, planId) => {
    if (!coupon.applicablePlans || coupon.applicablePlans.length === 0) return true; // empty = all plans
    return coupon.applicablePlans.some(p => p.toString() === planId.toString());
};

// ── ADMIN CRUD ──────────────────────────────────────────────────────────────

export const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find()
        .populate('createdBy', 'name email')
        .populate('applicablePlans', 'name price')
        .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: coupons.length, data: coupons });
});

export const getCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id)
        .populate('usedBy.userId', 'name email')
        .populate('applicablePlans', 'name price');
    if (!coupon) return next(new AppError('Coupon not found', 404));
    res.status(200).json({ success: true, data: coupon });
});

export const createCoupon = asyncHandler(async (req, res, next) => {
    const { code, description, discountType, discountAmount, discountPercent,
            maxPercentDiscount, expiresAt, isActive, applicablePlans } = req.body;

    if (!code) return next(new AppError('Coupon code is required', 400));

    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) return next(new AppError('Coupon code already exists', 400));

    try {
        const coupon = await Coupon.create({
            code: code.toUpperCase().trim(),
            description,
            discountType: discountType || 'fixed',
            discountAmount,
            discountPercent,
            maxPercentDiscount: maxPercentDiscount || null,
            applicablePlans: applicablePlans || [],
            expiresAt: expiresAt || null,
            isActive: isActive !== undefined ? isActive : true,
            createdBy: req.user.id
        });
        res.status(201).json({ success: true, data: coupon });
    } catch (err) {
        return next(new AppError(err.message, 400));
    }
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
    const { description, discountType, discountAmount, discountPercent,
            maxPercentDiscount, expiresAt, isActive, applicablePlans } = req.body;

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return next(new AppError('Coupon not found', 404));

    if (description !== undefined) coupon.description = description;
    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountAmount !== undefined) coupon.discountAmount = discountAmount;
    if (discountPercent !== undefined) coupon.discountPercent = discountPercent;
    if (maxPercentDiscount !== undefined) coupon.maxPercentDiscount = maxPercentDiscount || null;
    if (applicablePlans !== undefined) coupon.applicablePlans = applicablePlans;
    if (expiresAt !== undefined) coupon.expiresAt = expiresAt || null;
    if (isActive !== undefined) coupon.isActive = isActive;

    try {
        await coupon.save();
        res.status(200).json({ success: true, data: coupon });
    } catch (err) {
        return next(new AppError(err.message, 400));
    }
});

export const deleteCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return next(new AppError('Coupon not found', 404));
    await coupon.deleteOne();
    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
});

export const generateCode = asyncHandler(async (req, res) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code, exists = true;
    while (exists) {
        code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        exists = await Coupon.findOne({ code });
    }
    res.status(200).json({ success: true, code });
});

// ── USER — VALIDATE AT CHECKOUT ────────────────────────────────────────────

export const validateCoupon = asyncHandler(async (req, res, next) => {
    const { code, planId } = req.body;
    if (!code) return next(new AppError('Please provide a coupon code', 400));
    if (!planId) return next(new AppError('Please provide a plan ID', 400));

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) return next(new AppError('Invalid coupon code', 400));
    if (!coupon.isActive) return next(new AppError('This coupon is no longer active', 400));
    if (coupon.expiresAt && new Date() > coupon.expiresAt) return next(new AppError('This coupon has expired', 400));

    if (!isPlanApplicable(coupon, planId)) {
        return next(new AppError('This coupon is not valid for the selected plan', 400));
    }

    const alreadyUsed = coupon.usedBy.some(u => u.userId.toString() === req.user.id.toString());
    if (alreadyUsed) return next(new AppError('You have already used this coupon', 400));

    const plan = await Plan.findById(planId);
    if (!plan) return next(new AppError('Plan not found', 400));

    const actualDiscount = Math.min(computeDiscount(coupon, plan.price), plan.price - 1); // never make it free below ₹1
    const finalPrice = plan.price - actualDiscount;

    res.status(200).json({
        success: true,
        message: coupon.discountType === 'percentage'
            ? `Coupon applied! ${coupon.discountPercent}% off (₹${actualDiscount})`
            : `Coupon applied! ₹${actualDiscount} off`,
        data: {
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountPercent: coupon.discountPercent,
            actualDiscount,
            originalPrice: plan.price,
            finalPrice
        }
    });
});

// ── USER — SUGGESTED COUPONS FOR A PLAN ────────────────────────────────────

export const getSuggestedCoupons = asyncHandler(async (req, res, next) => {
    const { planId } = req.query;
    if (!planId) return next(new AppError('planId query param is required', 400));

    const plan = await Plan.findById(planId);
    if (!plan) return next(new AppError('Plan not found', 400));

    const now = new Date();

    // Mongo-safe combined query (single top-level $and avoids duplicate $or keys)
    const coupons = await Coupon.find({
        $and: [
            { isActive: true },
            { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
            { $or: [{ applicablePlans: { $size: 0 } }, { applicablePlans: planId }] }
        ]
    }).select('code description discountType discountAmount discountPercent maxPercentDiscount');

    // Filter out ones this user already used + attach computed discount
    const available = coupons
        .filter(c => !c.usedBy?.some(u => u.userId?.toString() === req.user.id.toString()))
        .map(c => ({
            code: c.code,
            description: c.description,
            discountType: c.discountType,
            discountPercent: c.discountPercent,
            discountAmount: c.discountAmount,
            estimatedDiscount: computeDiscount(c, plan.price)
        }))
        .sort((a, b) => b.estimatedDiscount - a.estimatedDiscount); // best deal first

    res.status(200).json({ success: true, data: available });
});

// ── INTERNAL — mark used after payment ─────────────────────────────────────

export const markCouponUsed = async ({ code, userId }) => {
    try {
        if (!code) return;
        const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
        if (!coupon) return;
        if (coupon.usedBy.some(u => u.userId.toString() === userId.toString())) return;
        coupon.usedBy.push({ userId, usedAt: new Date() });
        coupon.totalUses += 1;
        await coupon.save();
    } catch (err) {
        console.error('[Coupon] markCouponUsed error:', err);
    }
};

export { computeDiscount };