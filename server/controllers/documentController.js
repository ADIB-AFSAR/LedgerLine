import { bucket } from '../config/firebase.js';
import Document from '../models/Document.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { v4 as uuidv4 } from 'uuid';

// @desc      Upload document
// @route     POST /api/v1/documents
// @access    Private
export const uploadDocument = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload a file', 400));
    }

    const file = req.file;
    // Normalize filename: remove spaces and special characters from original name, keep extension
    const normalizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${uuidv4()}_${normalizedOriginalName}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
        metadata: {
            contentType: file.mimetype
        }
    });

    blobStream.on('error', (error) => {
        console.error(error);
        return next(new AppError('Something went wrong with file upload', 500));
    });

    blobStream.on('finish', async () => {
        try {
            // Get a signed URL with V4 - much more robust and standard
            const [url] = await fileUpload.getSignedUrl({
                version: 'v4',
                action: 'read',
                expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days (Max for V4)
            });

            const publicUrl = url;

            const document = await Document.create({
                userId: req.user.id,
                fileUrl: publicUrl,
                storagePath: fileName,
                fileName: file.originalname,
                fileType: file.mimetype
            });

            res.status(201).json({
                success: true,
                data: document
            });
        } catch (error) {
            console.error("Error finalizing document upload:", error);
            res.status(500).json({ success: false, message: error.message || "Error processing uploaded file" });
        }
    });

    blobStream.end(file.buffer);
});

// @desc      Get all user documents
// @route     GET /api/v1/documents
// @access    Private
export const getMyDocuments = asyncHandler(async (req, res, next) => {
    const documents = await Document.find({ userId: req.user.id });

    res.status(200).json({
        success: true,
        count: documents.length,
        data: documents
    });
});
