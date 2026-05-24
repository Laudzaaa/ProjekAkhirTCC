import express from 'express';
import {
  getMyPayments,
  getAllPayments,
  createPayment,
  updatePaymentStatus
} from '../controllers/payment.controller.js';
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

// USER
router.get('/', verifyToken, getMyPayments);
router.post('/', verifyToken, createPayment);

// ADMIN
router.get('/admin', verifyToken, isAdmin, getAllPayments);
router.put('/:id', verifyToken, isAdmin, updatePaymentStatus);

export default router;
