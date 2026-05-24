import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { verifyTokenMiddleware, verifyAdminRole } from '../middleware/verifyToken.js';

const router = express.Router();

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/profile', verifyTokenMiddleware, userController.getUserProfile);
router.put('/profile', verifyTokenMiddleware, userController.updateUserProfile);

// Admin routes
router.get('/', verifyTokenMiddleware, verifyAdminRole, userController.getAllUsers);
router.delete('/:uid', verifyTokenMiddleware, verifyAdminRole, userController.deleteUser);

export default router;
