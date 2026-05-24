import express from 'express';
import {
  getAllBuku,
  getBukuById,
  createBuku,
  updateBuku,
  deleteBuku
} from '../controllers/buku.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Public routes
router.get('/', getAllBuku);
router.get('/:id', getBukuById);

// Admin routes (protected)
router.post('/', verifyToken, createBuku);
router.put('/:id', verifyToken, updateBuku);
router.delete('/:id', verifyToken, deleteBuku);

export default router;
