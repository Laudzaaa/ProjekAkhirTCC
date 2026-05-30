import express from 'express';
import dotenv from 'dotenv';
import { healthCheck } from './config/firebase.js';

import userRoutes from './routes/user.routes.js';
import bookRoutes from './routes/book.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import reviewRoutes from './routes/review.routes.js';
import libraryRoutes from './routes/library.routes.js';
import { errorHandler } from './middleware/verifyToken.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware global
// Add explicit CORS responder before other middleware to guarantee
// preflight (OPTIONS) requests receive the required Access-Control headers.
app.use((req, res, next) => {
  const origin = req.get('Origin') || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', req.get('Access-Control-Request-Headers') || 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// Note: using manual CORS headers above; removed `cors` package usage
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// API Routing
// Explicit preflight handler for register endpoint to guarantee correct CORS response
app.options('/api/library/member/register', (req, res) => {
  const origin = req.get('Origin') || '*';
  console.log('Preflight for /api/library/member/register from', origin);
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', req.get('Access-Control-Request-Headers') || 'Content-Type, Authorization');
  return res.sendStatus(204);
});

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/library', libraryRoutes);

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

    app.listen(PORT, () => {
      console.log(`✅ Server berjalan di port ${PORT}`);
      console.log(`📚 API Perpustakaan Digital siap digunakan`);
    });

    // Health check dijalankan setelah server aktif supaya Cloud Run tidak
    // gagal start hanya karena Firestore sedang belum siap atau credential belum lengkap.
    healthCheck().catch((error) => {
      console.warn('⚠️ Firebase health check failed after startup:', error.message);
    });
  } catch (error) {
    console.error('❌ Gagal memulai server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
