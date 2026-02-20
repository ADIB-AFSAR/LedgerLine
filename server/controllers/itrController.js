import asyncHandler from '../middlewares/asyncHandler.js';
import ITRForm from '../models/ITRForm.js';
import Purchase from '../models/Purchase.js';
import AppError from '../utils/AppError.js';
import sendEmail from '../utils/sendEmail.js';

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
        });

    res.status(200).json({
        success: true,
        count: itrs.length,
        data: itrs
    });
});

// @desc      Get All ITRs (Admin/CA)
// @route     GET /api/v1/itr/all
// @access    Private (Admin/CA)
export const getAllITRs = asyncHandler(async (req, res, next) => {
    let query = {};

    // CA can only see assigned ITRs unless they are admin
    if (req.user.role === 'ca') {
        query.caAssigned = req.user.id;
    }

    const itrs = await ITRForm.find(query)
        .populate('userId', 'name email mobile')
        .populate('uploadedDocs')
        .populate({
            path: 'purchaseId',
            populate: {
                path: 'planId'
            }
        });

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
    if (req.user.role === 'ca' && itr.caAssigned?.toString() !== req.user.id.toString()) {
        return next(new AppError('Not authorized to update this ITR', 403));
    }

    itr.status = status;
    // itr.remarks = remarks; // Add remarks field to schema if needed

    await itr.save();

    // Send status update email
    try {
        // We need to fetch user email first
        const user = await Purchase.findOne({ _id: itr.purchaseId }).populate('userId'); // Indirectly getting user or just populate from itr if userId is ref
        // Actually itr has userId ref
        const itrWithUser = await ITRForm.findById(itr._id).populate('userId');

        if (itrWithUser && itrWithUser.userId) {
            await sendEmail({
                email: itrWithUser.userId.email,
                subject: `ITR Status Updated: ${status}`,
                message: `Your ITR filing status has been updated to: ${status}. Remarks: ${remarks || 'None'}`
            });
        }
    } catch (err) {
        console.error(err);
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
