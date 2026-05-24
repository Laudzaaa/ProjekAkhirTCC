import { Payment, Rental, Vehicle, User } from '../models/index.js';

// 🔍 Ambil semua pembayaran milik user yang login
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: {
        model: Rental,
        where: { user_id: req.user.id },
        include: [{ model: Vehicle, as: 'vehicle' }]
      },
      order: [['created_at', 'DESC']]
    });
    res.json(payments);
  } catch (err) {
    console.error('❌ Error getMyPayments:', err);
    res.status(500).json({ error: 'Gagal mengambil data pembayaran' });
  }
};

// ➕ Buat pembayaran untuk sewa (user)
export const createPayment = async (req, res) => {
  try {
    const { rental_id, payment_method, amount } = req.body;

    if (!rental_id || !payment_method || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Data pembayaran tidak lengkap atau tidak valid' });
    }

    const rental = await Rental.findByPk(rental_id);
    if (!rental) return res.status(404).json({ message: 'Data sewa tidak ditemukan' });
    if (rental.user_id !== req.user.id) return res.status(403).json({ message: 'Tidak diizinkan' });

    const payment = await Payment.create({
      rental_id,
      payment_method,
      amount
    });

    res.status(201).json({ message: 'Pembayaran berhasil dicatat', payment });
  } catch (err) {
    console.error('❌ Error createPayment:', err);
    res.status(400).json({ error: 'Gagal membuat pembayaran' });
  }
};

// ✅ Update status pembayaran dan kendaraan (admin only)
export const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: {
        model: Rental,
        include: [{ model: Vehicle, as: 'vehicle' }]
      }
    });

    if (!payment) return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });

    const newStatus = req.body.status;
    if (!['pending', 'paid', 'failed'].includes(newStatus)) {
      return res.status(400).json({ message: 'Status pembayaran tidak valid' });
    }

    await payment.update({ status: newStatus });

    const rental = payment.rental;
    const vehicle = rental?.vehicle;

    if (vehicle) {
      if (newStatus === 'paid') {
        await vehicle.update({ status: 'rented' });
      } else if (newStatus === 'failed') {
        await vehicle.update({ status: 'available' });
      }
    }

    res.json({ message: 'Status pembayaran dan kendaraan diperbarui', payment });
  } catch (err) {
    console.error('❌ Error updatePaymentStatus:', err);
    res.status(400).json({ error: 'Gagal memperbarui status pembayaran' });
  }
};

// 🔍 Semua pembayaran (admin only)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: {
        model: Rental,
        include: [
          { model: Vehicle, as: 'vehicle' },
          { model: User }
        ]
      },
      order: [['created_at', 'DESC']]
    });
    res.json(payments);
  } catch (err) {
    console.error('❌ Error getAllPayments:', err);
    res.status(500).json({ error: 'Gagal mengambil semua data pembayaran' });
  }
};
