import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },

    discountType: { type: String, enum: ['fixed', 'percentage'], default: 'fixed', required: true },
    discountAmount: { type: Number, min: 1 },   // required if fixed
    discountPercent: { type: Number, min: 1, max: 100 }, // required if percentage
    maxPercentDiscount: { type: Number, default: null }, // optional ₹ cap for percentage coupons

    applicablePlans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }], // empty = all plans

    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },

    usedBy: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        usedAt: { type: Date, default: Date.now }
    }],
    totalUses: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Validation: enforce correct field present per type
couponSchema.pre('validate', function (next) {
    if (this.discountType === 'fixed' && (!this.discountAmount || this.discountAmount <= 0)) {
        return next(new Error('discountAmount is required and must be > 0 for fixed coupons'));
    }
    if (this.discountType === 'percentage' && (!this.discountPercent || this.discountPercent <= 0 || this.discountPercent > 100)) {
        return next(new Error('discountPercent is required and must be 1-100 for percentage coupons'));
    }
    next();
});

couponSchema.virtual('isExpired').get(function () {
    return this.expiresAt ? new Date() > this.expiresAt : false;
});
couponSchema.set('toJSON', { virtuals: true });
couponSchema.set('toObject', { virtuals: true });

export default mongoose.model('Coupon', couponSchema);