import express from 'express';
import {
  createPengembalian,
  getPengembalianList,
  getPengembalianById,
  getMyPengembalian,
  markDendaPaid,
  getPengembalianStats
} from '../controllers/pengembalian.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Member routes
router.get('/my', verifyToken, getMyPengembalian);

// Admin routes
router.post('/', verifyToken, createPengembalian);
router.get('/', verifyToken, getPengembalianList);
router.get('/stats', verifyToken, getPengembalianStats);
router.get('/:id', verifyToken, getPengembalianById);
router.put('/:id/paid', verifyToken, markDendaPaid);

export default router;
