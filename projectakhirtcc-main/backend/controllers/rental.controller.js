import { Rental, Vehicle, User } from '../models/index.js';

// 🔍 Ambil semua penyewaan milik user yang login
export const getMyRentals = async (req, res) => {
  try {
    const rentals = await Rental.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Vehicle, as: 'vehicle' }],
      order: [['created_at', 'DESC']]
    });
    res.json(rentals);
  } catch (err) {
    console.error('❌ Error getMyRentals:', err);
    res.status(500).json({ error: 'Gagal mengambil data penyewaan Anda' });
  }
};

// 🔍 Ambil semua penyewaan (ADMIN only)
export const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.findAll({
      include: [
        { model: User },
        { model: Vehicle, as: 'vehicle' }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(rentals);
  } catch (err) {
    console.error('❌ Error getAllRentals:', err);
    res.status(500).json({ error: 'Gagal mengambil semua data penyewaan' });
  }
};

// ➕ Buat penyewaan baru
export const createRental = async (req, res) => {
  try {
    const { vehicle_id, start_date, end_date, total_price } = req.body;

    if (!vehicle_id || !start_date || !end_date || !total_price) {
      return res.status(400).json({ message: 'Data penyewaan tidak lengkap' });
    }

    const rental = await Rental.create({
      user_id: req.user.id,
      vehicle_id,
      start_date,
      end_date,
      total_price,
      status: 'booked'
    });

    res.status(201).json({ message: 'Penyewaan berhasil dibuat', rental });
  } catch (err) {
    console.error('❌ Error createRental:', err);
    res.status(400).json({ error: 'Gagal membuat penyewaan' });
  }
};

// ✏️ Update status sewa (admin only)
export const updateRentalStatus = async (req, res) => {
  try {
    const rental = await Rental.findByPk(req.params.id, {
      include: [{ model: Vehicle, as: 'vehicle' }]
    });

    if (!rental) return res.status(404).json({ message: 'Sewa tidak ditemukan' });

    const newStatus = req.body.status;
    if (!['booked', 'ongoing', 'completed', 'cancelled'].includes(newStatus)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    await rental.update({ status: newStatus });

    if (newStatus === 'completed' && rental.vehicle) {
      await rental.vehicle.update({ status: 'available' });
    }

    res.json({ message: 'Status sewa diperbarui', rental });
  } catch (err) {
    console.error('❌ Error updateRentalStatus:', err);
    res.status(400).json({ error: 'Gagal memperbarui status sewa' });
  }
};

// ❌ Hapus sewa (admin only)
export const deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findByPk(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Sewa tidak ditemukan' });

    await rental.destroy();
    res.json({ message: 'Sewa berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error deleteRental:', err);
    res.status(500).json({ error: 'Gagal menghapus sewa' });
  }
};
