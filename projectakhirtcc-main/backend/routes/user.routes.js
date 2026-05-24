import express from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/user.controller.js';
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

// ✅ Public endpoints
router.post('/register', register);
router.post('/login', login);

// ✅ Protected endpoints
router.get('/me', verifyToken, getMe);
router.get('/', verifyToken, isAdmin, getAllUsers); // hanya admin yang bisa akses semua user

export default router;
