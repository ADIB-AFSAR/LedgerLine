import mongoose from 'mongoose';

const pendingPaymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan',
            required: true,
        },
        serviceId: { type: String, default: null },
        planName: { type: String, required: true },
        planPrice: { type: Number, required: true },
        referralCoinsUsed: { type: Number, default: 0 },
        cashbackCoinsUsed: { type: Number, default: 0 },
        coinDiscountApplied: { type: Number, default: 0 },
        couponCode: { type: String, default: null },
        couponDiscount: { type: Number, default: 0 },
        referralCode: { type: String, default: null },
        finalAmountPaid: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

export default mongoose.model('PendingPayment', pendingPaymentSchema);
