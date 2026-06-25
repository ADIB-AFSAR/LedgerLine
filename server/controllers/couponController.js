import asyncHandler from '../middlewares/asyncHandler.js';
import Coupon from '../models/Coupon.js';
import Plan from '../models/Plan.js';
import AppError from '../utils/AppError.js';

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — CRUD
// ─────────────────────────────────────────────────────────────────────────────

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
export const getCoupons = asyncHandler(async (req, res, next) => {
    const coupons = await Coupon.find()
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: coupons.length,
        data: coupons
    });
});

// @desc    Get single coupon
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
export const getCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id)
        .populate('usedBy.userId', 'name email');

    if (!coupon) return next(new AppError('Coupon not found', 404));

    res.status(200).json({ success: true, data: coupon });
});

// @desc    Create coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res, next) => {
    const { code, description, discountAmount, expiresAt, isActive } = req.body;

    if (!code || !discountAmount) {
        return next(new AppError('Code and discount amount are required', 400));
    }

    // Check duplicate
    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
        return next(new AppError('Coupon code already exists', 400));
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase().trim(),
        description,
        discountAmount,
        expiresAt: expiresAt || null,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: coupon });
});

// @desc    Update coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res, next) => {
    const { description, discountAmount, expiresAt, isActive } = req.body;

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return next(new AppError('Coupon not found', 404));

    // Don't allow changing code or usedBy
    if (description !== undefined) coupon.description = description;
    if (discountAmount !== undefined) coupon.discountAmount = discountAmount;
    if (expiresAt !== undefined) coupon.expiresAt = expiresAt || null;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();

    res.status(200).json({ success: true, data: coupon });
});

// @desc    Delete coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return next(new AppError('Coupon not found', 404));

    await coupon.deleteOne();

    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
});

// @desc    Generate random coupon code
// @route   GET /api/v1/coupons/generate-code
// @access  Private/Admin
export const generateCode = asyncHandler(async (req, res, next) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let exists = true;

    // Keep generating until unique
    while (exists) {
        code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        exists = await Coupon.findOne({ code });
    }

    res.status(200).json({ success: true, code });
});

// ─────────────────────────────────────────────────────────────────────────────
// USER — VALIDATE COUPON AT CHECKOUT
// ─────────────────────────────────────────────────────────────────────────────

// @desc    Validate coupon at checkout
// @route   POST /api/v1/coupons/validate
// @access  Private
export const validateCoupon = asyncHandler(async (req, res, next) => {
    const { code, planId } = req.body;

    if (!code) return next(new AppError('Please provide a coupon code', 400));
    if (!planId) return next(new AppError('Please provide a plan ID', 400));

    // Find coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) {
        return next(new AppError('Invalid coupon code', 400));
    }

    // Check active
    if (!coupon.isActive) {
        return next(new AppError('This coupon is no longer active', 400));
    }

    // Check expiry
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return next(new AppError('This coupon has expired', 400));
    }

    // Check if user already used this coupon
    const alreadyUsed = coupon.usedBy.some(
        u => u.userId.toString() === req.user.id.toString()
    );
    if (alreadyUsed) {
        return next(new AppError('You have already used this coupon', 400));
    }

    // Get plan price for 50% cap
    const plan = await Plan.findById(planId);
    if (!plan) return next(new AppError('Plan not found', 400));

    const actualDiscount = Math.min(
        coupon.discountAmount,
        Math.max(plan.price - 1, 0)
    );

    const finalPrice = Math.max(plan.price - actualDiscount, 1);

    res.status(200).json({
        success: true,
        message: `Coupon applied! You save ₹${actualDiscount}`,
        data: {
            code: coupon.code,
            description: coupon.description,
            originalDiscount: coupon.discountAmount,
            actualDiscount,        // capped at 50%
            originalPrice: plan.price,
            finalPrice,
            // capped: coupon.discountAmount > maxDiscount 
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL — Mark coupon as used (call from paymentController after payment)
// ─────────────────────────────────────────────────────────────────────────────
export const markCouponUsed = async ({ code, userId }) => {
    try {
        if (!code) return;
        const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
        if (!coupon) return;

        // Double-check not already used
        const alreadyUsed = coupon.usedBy.some(u => u.userId.toString() === userId.toString());
        if (alreadyUsed) return;

        coupon.usedBy.push({ userId, usedAt: new Date() });
        coupon.totalUses += 1;
        await coupon.save();
    } catch (err) {
        console.error('[Coupon] markCouponUsed error:', err);
    }
};