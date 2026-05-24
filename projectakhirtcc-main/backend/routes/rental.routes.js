import express from 'express';
import {
  getMyRentals,
  getAllRentals,
  createRental,
  updateRentalStatus,
  deleteRental
} from '../controllers/rental.controller.js';
import { verifyToken, isAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

// Untuk USER login
router.get('/', verifyToken, getMyRentals);          // GET /rentals
router.post('/', verifyToken, createRental);         // POST /rentals

// Untuk ADMIN
router.get('/admin', verifyToken, isAdmin, getAllRentals);   // GET /rentals/admin
router.put('/:id', verifyToken, isAdmin, updateRentalStatus);
router.delete('/:id', verifyToken, isAdmin, deleteRental);

export default router;
