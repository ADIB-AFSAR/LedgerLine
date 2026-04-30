import { bucket } from '../config/firebase.js';
import Document from '../models/Document.js';
import ITRForm from '../models/ITRForm.js';
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

            // Sanitize sharedWith to handle "undefined" string from frontend
            const sharedWithId = (req.body.sharedWith && req.body.sharedWith !== 'undefined') ? req.body.sharedWith : null;

            const document = await Document.create({
                userId: sharedWithId || req.user.id,
                uploadedBy: req.user.id,
                sharedWith: sharedWithId,
                isShared: !!sharedWithId,
                fileUrl: publicUrl,
                storagePath: fileName,
                fileName: file.originalname,
                fileType: file.mimetype,
                formId: req.body.formId || null
            });

            if (req.body.formId && !!req.body.sharedWith) {
                await ITRForm.findByIdAndUpdate(req.body.formId, {
                    $push: { sharedDocuments: document._id }
                });
            }

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

// @desc      Get Shared Documents for a user
// @route     GET /api/v1/documents/shared/:userId
// @access    Private
export const getSharedDocuments = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const requestUserId = userId || req.user.id;

    if (!requestUserId || requestUserId === 'undefined') {
        return res.status(200).json({
            success: true,
            count: 0,
            data: []
        });
    }

    // Authorization check: Regular users can only see their own shared documents
    const isAdminOrCA = req.user.role === 'admin' || (req.user.role === 'ca' && req.user.adminStatus === 'approved');
    if (requestUserId.toString() !== req.user.id.toString() && !isAdminOrCA) {
        return next(new AppError('Not authorized to access these shared documents', 403));
    }

    const documents = await Document.find({ 
        sharedWith: requestUserId,
        isShared: true 
    }).sort({ uploadedAt: -1 });

    // Refresh URLs using the same logic as ITR controller
    const refreshedDocs = await Promise.all(documents.map(async (doc) => {
        const docObj = doc.toObject();
        let storagePath = docObj.storagePath;
        if (storagePath) {
            try {
                const [newUrl] = await bucket.file(storagePath).getSignedUrl({
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + 15 * 60 * 1000
                });
                docObj.fileUrl = newUrl;
            } catch (err) {
                console.error('URL refresh failed for shared doc:', err);
            }
        }
        return docObj;
    }));

    res.status(200).json({
        success: true,
        count: refreshedDocs.length,
        data: refreshedDocs
    });
});
