import express from 'express';
import {
  createPeminjaman,
  getPeminjamanList,
  getMyPeminjaman,
  getPeminjamanById,
  markPeminjamanReturned,
  getPeminjamanStats,
  approvePeminjaman,
  rejectPeminjaman
} from '../controllers/peminjaman.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Member routes
router.post('/', verifyToken, createPeminjaman);
router.get('/my', verifyToken, getMyPeminjaman);

// Admin routes
router.put('/:id_peminjaman/approve', verifyToken, approvePeminjaman);
router.delete('/:id_peminjaman/reject', verifyToken, rejectPeminjaman);
router.get('/', verifyToken, getPeminjamanList);
router.get('/stats', verifyToken, getPeminjamanStats);
router.get('/:id', verifyToken, getPeminjamanById);
router.put('/:id/return', verifyToken, markPeminjamanReturned);

export default router;
