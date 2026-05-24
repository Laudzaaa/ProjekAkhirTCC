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
app.use(cors());
app.use(express.json());

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

// Root endpoint
app.get('/', (req, res) => {
  res.send('✅ API Server Aktif - Rental Kendaraan & Perpustakaan 🚗📚');
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
    await db.sync();
  } catch (error) {
    console.error('❌ Gagal koneksi ke database:', error.message);
    process.exit(1); // Membatalkan startup agar Cloud Run tahu container gagal
  }
};
connectDB();

// Jalankan server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server berjalan di port ${PORT}`);
});

