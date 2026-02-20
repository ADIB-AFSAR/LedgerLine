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
    const fileName = `${uuidv4()}_${file.originalname}`;
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
        // Get public URL (Make sure bucket is public or generate signed URL)
        // For security, generated signed URL is better, or make file public

        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        const document = await Document.create({
            userId: req.user.id,
            // formId: req.body.formId, // Optional link to form
            fileUrl: publicUrl,
            fileName: file.originalname,
            fileType: file.mimetype
        });

        res.status(201).json({
            success: true,
            data: document
        });
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
