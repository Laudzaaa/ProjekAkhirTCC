import express from 'express';
import * as userController from '../controllers/user.controller.js';
import * as bookController from '../controllers/book.controller.js';
import * as favoriteController from '../controllers/favorite.controller.js';
import * as reviewController from '../controllers/review.controller.js';
import { verifyTokenMiddleware, verifyAdminRole } from '../middleware/verifyToken.js';
import multer from 'multer';

const router = express.Router();

// Multer storage configuration for books upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 52428800 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|epub|mobi|txt|doc|docx/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(file.originalname.split('.').pop());
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type tidak didukung'));
    }
  },
});

// Member/User routes
router.post('/member/register', userController.registerUser);
router.post('/member/login', userController.loginUser);
router.get('/member/profile', verifyTokenMiddleware, userController.getUserProfile);
router.put('/member/profile', verifyTokenMiddleware, userController.updateUserProfile);
router.get('/member', verifyTokenMiddleware, verifyAdminRole, userController.getAllUsers);
router.delete('/member/:uid', verifyTokenMiddleware, verifyAdminRole, userController.deleteUser);

// Buku routes
router.get('/buku', bookController.getAllBooks);
router.get('/buku/:id', bookController.getBookById);
router.post('/buku', verifyTokenMiddleware, verifyAdminRole, upload.single('file'), bookController.createBook);
router.put('/buku/:id', verifyTokenMiddleware, verifyAdminRole, bookController.updateBook);
router.delete('/buku/:id', verifyTokenMiddleware, verifyAdminRole, bookController.deleteBook);
router.post('/buku/:id/download', verifyTokenMiddleware, bookController.downloadBook);

// Favorite routes
router.post('/favorite', verifyTokenMiddleware, favoriteController.addFavorite);
router.delete('/favorite/:bookId', verifyTokenMiddleware, favoriteController.removeFavorite);
router.get('/favorite', verifyTokenMiddleware, favoriteController.getUserFavorites);
router.get('/favorite/check/:bookId', verifyTokenMiddleware, favoriteController.isFavorite);

// Review routes
router.get('/review/:bookId', reviewController.getReviewsByBook);
router.post('/review', verifyTokenMiddleware, reviewController.createReview);
router.put('/review/:reviewId', verifyTokenMiddleware, reviewController.updateReview);
router.delete('/review/:reviewId', verifyTokenMiddleware, reviewController.deleteReview);

export default router;
