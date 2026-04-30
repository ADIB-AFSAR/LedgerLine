import mongoose from 'mongoose';

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
    }
}, {
    timestamps: true
});

export default mongoose.model('Purchase', purchaseSchema);
