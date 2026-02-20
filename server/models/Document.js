import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ITRForm'
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String
    },
    fileType: {
        type: String, // e.g., 'application/pdf', 'image/jpeg'
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Document', documentSchema);
