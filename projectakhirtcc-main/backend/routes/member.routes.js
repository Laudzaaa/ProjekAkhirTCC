import express from 'express';
import {
  registerMember,
  loginMember,
  getMemberProfile,
  updateMemberProfile,
  getAllMembers,
  getMemberById,
  deleteMember
} from '../controllers/member.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Public routes
router.post('/register', registerMember);
router.post('/login', loginMember);

// Protected routes
router.get('/profile', verifyToken, getMemberProfile);
router.put('/profile', verifyToken, updateMemberProfile);

// Admin routes
router.get('/', verifyToken, getAllMembers);
router.get('/:id', verifyToken, getMemberById);
router.delete('/:id', verifyToken, deleteMember);

export default router;
