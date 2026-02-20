import asyncHandler from '../middlewares/asyncHandler.js';
import Plan from '../models/Plan.js';
import AppError from '../utils/AppError.js';

// @desc      Get all plans
// @route     GET /api/v1/plans
// @access    Public
export const getPlans = asyncHandler(async (req, res, next) => {
    const plans = await Plan.find({ isActive: true });

    res.status(200).json({
        success: true,
        count: plans.length,
        data: plans
    });
});

// @desc      Get single plan
// @route     GET /api/v1/plans/:id
// @access    Public
export const getPlan = asyncHandler(async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
        return next(new AppError(`Plan not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: plan
    });
});

// @desc      Create new plan
// @route     POST /api/v1/plans
// @access    Private (Admin only)
export const createPlan = asyncHandler(async (req, res, next) => {
    // Add user to req,body
    req.body.user = req.user.id;

    const plan = await Plan.create(req.body);

    res.status(201).json({
        success: true,
        data: plan
    });
});

// @desc      Update plan
// @route     PUT /api/v1/plans/:id
// @access    Private (Admin only)
export const updatePlan = asyncHandler(async (req, res, next) => {
    let plan = await Plan.findById(req.params.id);

    if (!plan) {
        return next(new AppError(`Plan not found with id of ${req.params.id}`, 404));
    }

    plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: plan
    });
});

// @desc      Delete plan
// @route     DELETE /api/v1/plans/:id
// @access    Private (Admin only)
export const deletePlan = asyncHandler(async (req, res, next) => {
    const plan = await Plan.findByIdAndDelete(req.params.id);

    if (!plan) {
        return next(new AppError(`Plan not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: {}
    });
});
