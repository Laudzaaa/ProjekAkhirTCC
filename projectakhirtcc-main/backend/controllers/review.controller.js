import { Review } from '../models/index.js';
import User from '../models/User.js';

// 🔍 Ambil semua review kendaraan tertentu
export const getReviewsByVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;

    if (!vehicleId) {
      return res.status(400).json({ message: 'ID kendaraan tidak ditemukan' });
    }

    const reviews = await Review.findAll({
      where: { vehicle_id: vehicleId },
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(reviews);
  } catch (err) {
    console.error('❌ Error getReviewsByVehicle:', err);
    res.status(500).json({ error: 'Gagal mengambil review kendaraan' });
  }
};

// ➕ Tambahkan review (hanya user login)
export const createReview = async (req, res) => {
  try {
    const { vehicle_id, rating, comment } = req.body;

    if (!vehicle_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating tidak valid atau data tidak lengkap' });
    }

    const review = await Review.create({
      user_id: req.user.id,
      vehicle_id,
      rating,
      comment
    });

    res.status(201).json({ message: 'Review berhasil ditambahkan', review });
  } catch (err) {
    console.error('❌ Error createReview:', err);
    res.status(400).json({ error: 'Gagal menambahkan review' });
  }
};
