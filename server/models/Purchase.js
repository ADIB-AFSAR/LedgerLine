import mongoose from 'mongoose';
import { createModel } from '../config/database.js';

const purchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    planName: {
        type: String,
        required: true
    },
    planPrice: {
        type: Number,
        required: true,
        default: 0
    },
    paymentId: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    formUnlocked: {
        type: Boolean,
        default: false
    },
    coinDiscountApplied: {
    type: Number,
    default: 0
    },

    referralCoinsUsed: {
        type: Number,
        default: 0
    },

    cashbackCoinsUsed: {
        type: Number,
        default: 0
    },

    finalAmountPaid: {
        type: Number,
        default: 0
    },
    couponCode: {
    type: String,
    default: null
    },
    couponDiscount: {
        type: Number,
        default: 0
    },
    originalPrice: {
    type: Number,
    default: 0
},
},
 {
    timestamps: true
});

export default createModel(mongoose, 'Purchase', purchaseSchema, 'purchases');
