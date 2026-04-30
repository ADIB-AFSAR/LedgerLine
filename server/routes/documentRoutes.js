import express from 'express';
import { uploadDocument, getMyDocuments, getSharedDocuments } from '../controllers/documentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.single('file'), uploadDocument);
router.get('/', getMyDocuments);
router.get('/shared/:userId', getSharedDocuments);

export default router;
