import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  toggleFavorite,
  getMyFavorites,
  getTotalFavorites,
} from '../controllers/favorite.controller.js';

const router = express.Router();

router.post('/:vehicleId', verifyToken, toggleFavorite);
router.get('/', verifyToken, getMyFavorites);
router.get('/total', verifyToken, getTotalFavorites);

export default router;
