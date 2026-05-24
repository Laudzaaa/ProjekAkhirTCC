import express from 'express';
import {
  getReviewsByVehicle,
  createReview
} from '../controllers/review.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import Review from '../models/Review.js';

const router = express.Router();

// ✅ LETAKKAN INI DULU — lebih spesifik
router.get('/my-reviews', verifyToken, async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { user_id: req.user.id }
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST untuk tambah review (harus login)
router.post('/', verifyToken, createReview);

// ⛔ INI HARUS PALING BAWAH — karena /:vehicleId itu dinamis
router.get('/:vehicleId', getReviewsByVehicle);

export default router;
