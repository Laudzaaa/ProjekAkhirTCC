import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthCheck } from './config/firebase.js';

import userRoutes from './routes/user.routes.js';
import bookRoutes from './routes/book.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import reviewRoutes from './routes/review.routes.js';
import { errorHandler } from './middleware/verifyToken.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware global
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// API Routing
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const isHealthy = await healthCheck();
    if (isHealthy) {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development',
      });
    } else {
      res.status(503).json({ status: 'unhealthy' });
    }
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: '✅ API Perpustakaan Digital Kampus Aktif 📚',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
  });
});

// Global error handler
app.use(errorHandler);

// Koneksi Firebase dan start server
const startServer = async () => {
  try {
    console.log('🚀 Memulai backend Perpustakaan Digital...');

    const isHealthy = await healthCheck();
    if (!isHealthy) {
      console.error('❌ Firebase connection failed');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`✅ Server berjalan di port ${PORT}`);
      console.log(`📚 API Perpustakaan Digital siap digunakan`);
    });
  } catch (error) {
    console.error('❌ Gagal memulai server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
