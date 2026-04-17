import express from 'express';
import { generateCode, modifyFile } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateCode);
router.post('/modify', protect, modifyFile);

export default router;