import { Vehicle, Review } from '../models/index.js';
import { Sequelize } from 'sequelize';

// 🔍 Ambil semua kendaraan + average rating dari Review
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('reviews.rating')), 'averageRating']
        ]
      },
      include: [
        {
          model: Review,
          attributes: []
        }
      ],
      group: ['vehicles.id'],
      raw: true,
      nest: true
    });

    res.json(vehicles);
  } catch (err) {
    console.error('❌ Gagal ambil kendaraan:', err);
    res.status(500).json({ error: 'Gagal mengambil data kendaraan' });
  }
};

// ➕ Tambah kendaraan baru (admin only)
export const createVehicle = async (req, res) => {
  try {
    const { type, brand, model, plate_number, price_per_day, image_url } = req.body;

    if (!type || !brand || !model || !plate_number || !price_per_day) {
      return res.status(400).json({ message: 'Data kendaraan tidak lengkap' });
    }

    const vehicle = await Vehicle.create({
      type,
      brand,
      model,
      plate_number,
      price_per_day,
      image_url
    });

    res.status(201).json({ message: 'Kendaraan berhasil ditambahkan', vehicle });
  } catch (err) {
    console.error('❌ Error tambah kendaraan:', err);
    res.status(400).json({ error: 'Gagal menambahkan kendaraan' });
  }
};

// ✏️ Update kendaraan
export const updateVehicle = async (req, res) => {
  try {
    const id = req.params.id;
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) return res.status(404).json({ message: 'Kendaraan tidak ditemukan' });

    await vehicle.update(req.body);
    res.json({ message: 'Kendaraan berhasil diupdate', vehicle });
  } catch (err) {
    console.error('❌ Error update kendaraan:', err);
    res.status(400).json({ error: 'Gagal mengupdate kendaraan' });
  }
};

// ❌ Hapus kendaraan
export const deleteVehicle = async (req, res) => {
  try {
    const id = req.params.id;
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) return res.status(404).json({ message: 'Kendaraan tidak ditemukan' });

    await vehicle.destroy();
    res.json({ message: 'Kendaraan berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error hapus kendaraan:', err);
    res.status(500).json({ error: 'Gagal menghapus kendaraan' });
  }
};

// 🔍 Ambil detail satu kendaraan
export const getVehicleById = async (req, res) => {
  try {
    const id = req.params.id;
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) return res.status(404).json({ message: 'Kendaraan tidak ditemukan' });

    res.json(vehicle);
  } catch (err) {
    console.error('❌ Error getVehicleById:', err);
    res.status(500).json({ error: 'Gagal mengambil detail kendaraan' });
  }
};
