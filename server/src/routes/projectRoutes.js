import express from 'express';
import { saveProject, getProjects } from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/save', protect, saveProject);
router.get('/', protect, getProjects);

export default router;