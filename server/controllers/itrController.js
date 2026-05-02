import asyncHandler from '../middlewares/asyncHandler.js';
import ITRForm from '../models/ITRForm.js';
import Purchase from '../models/Purchase.js';
import AppError from '../utils/AppError.js';
import sendEmail from '../utils/sendEmail.js';
import { getStatusUpdateTemplate } from '../utils/emailTemplates.js';
import { bucket } from '../config/firebase.js';

// Helper to refresh signed URLs for documents
const refreshDocumentUrls = async (documents) => {
    if (!documents || !Array.isArray(documents)) return documents;

    const refreshedDocs = await Promise.all(documents.map(async (doc) => {
        // If it's a plain object (not mongoose doc), convert or handle
        const docObj = doc.toObject ? doc.toObject() : doc;
        
        // We need the storage path to re-sign. 
        // If storagePath is missing (old docs), we try to extract it from the URL
        let storagePath = docObj.storagePath;
        if (!storagePath && docObj.fileUrl) {
            try {
                const url = new URL(docObj.fileUrl);
                const pathParts = url.pathname.split('/');
                storagePath = decodeURIComponent(pathParts[pathParts.length - 1]);
            } catch (e) {
                console.error('Failed to extract storage path from URL:', docObj.fileUrl);
            }
        }

        if (storagePath) {
            try {
                const [newUrl] = await bucket.file(storagePath).getSignedUrl({
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + 15 * 60 * 1000 // 15 mins fresh URL
                });
                return { ...docObj, fileUrl: newUrl };
            } catch (err) {
                console.error(`Failed to refresh URL for ${storagePath}:`, err.message);
                return docObj;
            }
        }
        return docObj;
    }));
    
    return refreshedDocs;
};

// @desc      Submit ITR Form
// @route     POST /api/v1/itr
// @access    Private
export const submitITR = asyncHandler(async (req, res, next) => {
    const { purchaseId, formType, personalInfo, incomeDetails, uploadedDocs } = req.body;

    // Check if user has purchased a plan for this filing
    const purchase = await Purchase.findOne({
        _id: purchaseId,
        userId: req.user.id,
        paymentStatus: 'Completed',
        formUnlocked: true
    });

    if (!purchase) {
        return next(new AppError('No valid purchase found for this form submission', 400));
    }

    // Check if ITR is already submitted for this purchase
    const existingITR = await ITRForm.findOne({ purchaseId });
    if (existingITR) {
        return next(new AppError('ITR already submitted for this purchase', 400));
    }

    const itrForm = await ITRForm.create({
        userId: req.user.id,
        purchaseId,
        formType,
        personalInfo,
        incomeDetails,
        uploadedDocs,
        status: 'Pending',
        submittedAt: Date.now()
    });

    res.status(201).json({
        success: true,
        data: itrForm
    });
});

// @desc      Get My ITRs
// @route     GET /api/v1/itr
// @access    Private
export const getMyITRs = asyncHandler(async (req, res, next) => {
    const itrs = await ITRForm.find({ userId: req.user.id })
        .populate('uploadedDocs')
        .populate({
            path: 'purchaseId',
            populate: {
                path: 'planId'
            }
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: itrs.length,
        data: itrs
    });
});

// @desc      Get Single ITR
// @route     GET /api/v1/itr/:id
// @access    Private
export const getITRById = asyncHandler(async (req, res, next) => {
    const itr = await ITRForm.findById(req.params.id)
        .populate('uploadedDocs')
        .populate('sharedDocuments')
        .populate({
            path: 'purchaseId',
            populate: {
                path: 'planId'
            }
        });

    if (!itr) {
        return next(new AppError('ITR Form not found', 404));
    }

    // Check ownership or role
    const isAdminOrCA = req.user.role === 'admin' || req.user.role === 'ca';
    if (itr.userId.toString() !== req.user.id.toString() && !isAdminOrCA) {
        return next(new AppError('Not authorized to access this ITR', 403));
    }

    // Refresh signed URLs for documents
    const itrObj = itr.toObject();
    if (itrObj.uploadedDocs) {
        itrObj.uploadedDocs = await refreshDocumentUrls(itr.uploadedDocs);
    }
    
    // Refresh shared documents
    if (itrObj.sharedDocuments) {
        itrObj.sharedDocuments = await refreshDocumentUrls(itr.sharedDocuments);
    }

    // Also refresh docs in requests
    if (itrObj.documentRequests) {
        for (let req of itrObj.documentRequests) {
            if (req.responseDocs) {
                req.responseDocs = await refreshDocumentUrls(req.responseDocs);
            }
        }
    }

    res.status(200).json({
        success: true,
        data: itrObj
    });
});

// @desc      Get All ITRs (Admin/CA)
// @route     GET /api/v1/itr/all
// @access    Private (Admin/CA)
export const getAllITRs = asyncHandler(async (req, res, next) => {
    let query = {};

    // CA can only see assigned ITRs unless they are admin
    // if (req.user.role === 'ca') {
    //     query.caAssigned = req.user.id;
    // }

    const itrs = await ITRForm.find(query)
        .populate('userId', 'name email mobile')
        .populate('caAssigned', 'name email')
        .populate('uploadedDocs')
        .populate({
            path: 'purchaseId',
            populate: {
                path: 'planId'
            }
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: itrs.length,
        data: itrs
    });
});

// @desc      Update ITR Status
// @route     PUT /api/v1/itr/:id/status
// @access    Private (Admin/CA)
export const updateITRStatus = asyncHandler(async (req, res, next) => {
    const { status, remarks } = req.body;

    let itr = await ITRForm.findById(req.params.id);

    if (!itr) {
        return next(new AppError('ITR Form not found', 404));
    }

    // Check authorization for CA
    // if (req.user.role === 'ca' && itr.caAssigned?.toString() !== req.user.id.toString()) {
    //     return next(new AppError('Not authorized to update this ITR', 403));
    // }

    itr.status = status;
    // itr.remarks = remarks; // Add remarks field to schema if needed

    await itr.save();

    // Send status update email
    try {
        const fullItr = await ITRForm.findById(itr._id)
            .populate('userId')
            .populate('caAssigned')
            .populate({
                path: 'purchaseId',
                populate: { path: 'planId' }
            });

        if (fullItr && fullItr.userId) {
            await sendEmail({
                email: fullItr.userId.email,
                subject: `Powerfiling Update: Your ITR Status is now ${status}`,
                message: `Your ITR filing status for ${fullItr.purchaseId?.planId?.name || fullItr.purchaseId?.planName || 'Tax Filing'} has been updated to: ${status}.`,
                html: getStatusUpdateTemplate(fullItr.userId, fullItr, status, remarks, req.user.name, req.user.email)
            });
        }
    } catch (err) {
        console.error('Failed to send status update email:', err);
    }

    res.status(200).json({
        success: true,
        data: itr
    });
});

// @desc      Assign CA
// @route     PUT /api/v1/itr/:id/assign
// @access    Private (Admin only)
export const assignCA = asyncHandler(async (req, res, next) => {
    const { caId } = req.body;

    const itr = await ITRForm.findById(req.params.id);

    if (!itr) {
        return next(new AppError('ITR Form not found', 404));
    }

    itr.caAssigned = caId;
    itr.status = 'CA Reviewing';

    await itr.save();

    res.status(200).json({
        success: true,
        data: itr
    });
});

// @desc      Request Document from User
// @route     POST /api/v1/itr/:id/request-document
// @access    Private (Admin/CA)
export const requestDocument = asyncHandler(async (req, res, next) => {
    const { message } = req.body;

    const itr = await ITRForm.findById(req.params.id);

    if (!itr) {
        return next(new AppError('ITR Form not found', 404));
    }

    itr.documentRequests.push({
        message,
        requestedBy: req.user.id,
        requestedAt: Date.now(),
        status: 'Pending'
    });

    await itr.save();

    // Re-fetch with population
    const updatedItr = await ITRForm.findById(itr._id)
        .populate('uploadedDocs')
        .populate('caAssigned', 'name email')
        .populate({
            path: 'purchaseId',
            populate: {
                path: 'planId'
            }
        });

    res.status(200).json({
        success: true,
        message: 'Document request sent successfully',
        data: updatedItr
    });
});

// @desc      Fulfill Document Request
// @route     PUT /api/v1/itr/:id/request/:requestId/fulfill
// @access    Private (User)
export const fulfillDocumentRequest = asyncHandler(async (req, res, next) => {
    const { documentId } = req.body;

    const itr = await ITRForm.findById(req.params.id);

    if (!itr) {
        return next(new AppError('ITR Form not found', 404));
    }

    const request = itr.documentRequests.id(req.params.requestId);

    if (!request) {
        return next(new AppError('Document request not found', 404));
    }

    request.responseDocs.push(documentId);
    request.status = 'Fulfilled';

    // Automatically add to main uploadedDocs array if not already present
    const docExists = itr.uploadedDocs.some(doc => doc.toString() === documentId.toString());
    if (!docExists) {
        itr.uploadedDocs.push(documentId);
    }

    await itr.save();

    // Re-fetch with population to return complete data to frontend
    const updatedItr = await ITRForm.findById(itr._id)
        .populate('uploadedDocs')
        .populate('caAssigned', 'name email')
        .populate({
            path: 'purchaseId',
            populate: {
                path: 'planId'
            }
        });

    res.status(200).json({
        success: true,
        message: 'Document uploaded successfully in response to request',
        data: updatedItr
    });
});
