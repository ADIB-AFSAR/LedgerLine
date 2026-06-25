import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Basic', 'Premium', 'Business'],
        required: true
    },
    features: {
        type: [String],
        required: true
    },
    formType: {
        type: String,
        enum: ['ITR1', 'ITR2', 'ITR3', 'ITR4', 'GST', 'OTHER'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Plan', planSchema);
