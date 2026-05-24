import express from 'express';
import * as favoriteController from '../controllers/favorite.controller.js';
import { verifyTokenMiddleware } from '../middleware/verifyToken.js';

const router = express.Router();

// All routes require authentication
router.post('/', verifyTokenMiddleware, favoriteController.addFavorite);
router.delete('/:bookId', verifyTokenMiddleware, favoriteController.removeFavorite);
router.get('/', verifyTokenMiddleware, favoriteController.getUserFavorites);
router.get('/check/:bookId', verifyTokenMiddleware, favoriteController.isFavorite);

export default router;
