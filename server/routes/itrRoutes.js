import express from 'express';
import {
    submitITR,
    getMyITRs,
    getAllITRs,
    updateITRStatus,
    assignCA
} from '../controllers/itrController.js';

import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
    .route('/')
    .post(submitITR)
    .get(getMyITRs);

router.get('/all', authorize('admin', 'ca'), getAllITRs);

router.put('/:id/status', authorize('admin', 'ca'), updateITRStatus);
router.put('/:id/assign', authorize('admin'), assignCA);

export default router;
