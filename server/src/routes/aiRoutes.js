import express from 'express';
import { generateCode } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateCode);

export default router;