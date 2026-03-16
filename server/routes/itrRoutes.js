import express from 'express';
import {
    submitITR,
    getMyITRs,
    getITRById,
    getAllITRs,
    updateITRStatus,
    assignCA,
    requestDocument,
    fulfillDocumentRequest
} from '../controllers/itrController.js';

import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
    .route('/')
    .post(submitITR)
    .get(getMyITRs);

router.get('/all', authorize('admin', 'ca'), getAllITRs);

router
    .route('/:id')
    .get(getITRById);

router.put('/:id/status', authorize('admin', 'ca'), updateITRStatus);
router.put('/:id/assign', authorize('admin'), assignCA);
router.post('/:id/request-document', authorize('admin', 'ca'), requestDocument);
router.put('/:id/request/:requestId/fulfill', fulfillDocumentRequest);

export default router;
