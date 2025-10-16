import express from 'express';
import { login, verify } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', verifyToken, verify);

export default router;