import mongoose from 'mongoose';

const itrFormSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase',
        required: true
    },
    formType: {
        type: String,
        required: true
    },
    personalInfo: {
        type: Object, // Could be more specific based on exact form requirements
        default: {}
    },
    incomeDetails: {
        type: Object, // Could be more specific
        default: {}
    },
    uploadedDocs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }],
    status: {
        type: String,
        enum: ['Pending', 'CA Reviewing', 'Filed', 'Completed', 'Rejected'],
        default: 'Pending'
    },
    caAssigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Only users with role 'ca' or 'admin'
    },
    submittedAt: {
        type: Date
    },
    documentRequests: [{
        message: String,
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        requestedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['Pending', 'Fulfilled'],
            default: 'Pending'
        },
        responseDocs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document'
        }]
    }],
    sharedDocuments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }]
}, {
    timestamps: true
});

export default mongoose.model('ITRForm', itrFormSchema);
