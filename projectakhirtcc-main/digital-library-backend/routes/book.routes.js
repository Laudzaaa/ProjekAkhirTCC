import express from 'express';
import * as bookController from '../controllers/book.controller.js';
import { verifyTokenMiddleware, verifyAdminRole } from '../middleware/verifyToken.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
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

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Protected routes
router.post('/', verifyTokenMiddleware, verifyAdminRole, upload.single('file'), bookController.createBook);
router.put('/:id', verifyTokenMiddleware, verifyAdminRole, bookController.updateBook);
router.delete('/:id', verifyTokenMiddleware, verifyAdminRole, bookController.deleteBook);
router.post('/:id/download', verifyTokenMiddleware, bookController.downloadBook);

export default router;
