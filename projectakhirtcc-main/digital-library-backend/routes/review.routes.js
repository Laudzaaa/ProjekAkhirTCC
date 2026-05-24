import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { verifyTokenMiddleware, verifyAdminRole } from '../middleware/verifyToken.js';

const router = express.Router();

// Public routes
router.get('/:bookId', reviewController.getReviewsByBook);

// Protected routes
router.post('/', verifyTokenMiddleware, reviewController.createReview);
router.put('/:reviewId', verifyTokenMiddleware, reviewController.updateReview);
router.delete('/:reviewId', verifyTokenMiddleware, reviewController.deleteReview);

export default router;
