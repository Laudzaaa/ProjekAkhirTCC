import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database.js';

// Import all models to establish associations before sync
import {
  // Rental Vehicle API
  User,
  Vehicle,
  Rental,
  Payment,
  Review,
  Favorite,
  // Library API
  Buku,
  Member,
  Peminjaman,
  Pengembalian
} from './models/index.js';

// Rental Vehicle API Routes
import userRoutes from './routes/user.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import rentalRoutes from './routes/rental.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';

// Library API Routes
import bukuRoutes from './routes/buku.routes.js';
import memberRoutes from './routes/member.routes.js';
import peminjamanRoutes from './routes/peminjaman.routes.js';
import pengembalianRoutes from './routes/pengembalian.routes.js';

dotenv.config();
const app = express();

// Log startup
console.log('🚀 Memulai backend...');

// Middleware global
// CORS configuration
const corsOptions = {
  origin: [
    'https://frontend-service-dot-e-31-489014.et.r.appspot.com',
    'https://e-31-489014.et.r.appspot.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routing - Rental Vehicle API
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);

// API Routing - Library API
app.use('/api/library/buku', bukuRoutes);
app.use('/api/library/member', memberRoutes);
app.use('/api/library/peminjaman', peminjamanRoutes);
app.use('/api/library/pengembalian', pengembalianRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'backend-api',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: '✅ REST API Aktif - Rental Kendaraan & Perpustakaan 🚗📚',
    deployment: 'App Engine standard',
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Koneksi DB
const connectDB = async () => {
  try {
    console.log('🔌 Menghubungkan ke database...');
    await db.authenticate();
    console.log('✅ Koneksi database berhasil!');
    try {
      await db.query('ALTER TABLE bukus MODIFY foto_url TEXT');
      console.log('✅ Kolom foto_url diperbarui ke TEXT');
    } catch (error) {
      console.warn('⚠️ Tidak dapat mengubah kolom foto_url:', error.message);
    }
    try {
      await db.query("ALTER TABLE peminjamans MODIFY status ENUM('pending','aktif','dikembalikan','hilang') NOT NULL DEFAULT 'pending'");
      console.log("✅ Kolom status pada tabel peminjamans diperbarui (ENUM)");
    } catch (error) {
      console.warn('⚠️ Tidak dapat mengubah kolom status peminjamans:', error.message);
    }
    try {
      const [cols] = await db.query("SHOW COLUMNS FROM peminjamans LIKE 'status'");
      console.log('🔎 peminjamans.status column definition:', cols);
    } catch (error) {
      console.warn('⚠️ Gagal membaca definisi kolom status peminjamans:', error.message);
    }
    await db.sync();
  } catch (error) {
    console.error('❌ Gagal koneksi ke database:', error.message);
    process.exit(1);
  }
};

// Jalankan server setelah database siap
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server berjalan di port ${PORT}`);
  });
};

startServer();

