import { Buku } from '../models/index.js';
import { Op } from 'sequelize';

// ✅ Get all books
export const getAllBuku = async (req, res) => {
  try {
    const { kategori, search } = req.query;
    
    let where = {};
    if (kategori) where.kategori = kategori;
    if (search) {
      where = {
        ...where,
        [Op.or]: [
          { judul: { [Op.like]: `%${search}%` } },
          { pengarang: { [Op.like]: `%${search}%` } },
          { isbn: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const books = await Buku.findAll({ where, order: [['created_at', 'DESC']] });
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get book by ID
export const getBukuById = async (req, res) => {
  try {
    const book = await Buku.findByPk(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Create new book
export const createBuku = async (req, res) => {
  try {
    const { judul, pengarang, penerbit, isbn, kategori, tahun_terbit, stok, lokasi, deskripsi, foto_url } = req.body;
    
    const book = await Buku.create({
      judul,
      pengarang,
      penerbit,
      isbn,
      kategori,
      tahun_terbit,
      stok,
      stok_tersedia: stok,
      lokasi,
      deskripsi,
      foto_url
    });
    
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update book
export const updateBuku = async (req, res) => {
  try {
    const book = await Buku.findByPk(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });

    const body = req.body || {};
    if (!req.body) {
      return res.status(400).json({ success: false, message: 'Request body kosong' });
    }

    const updates = {};
    const allowedFields = [
      'judul',
      'pengarang',
      'penerbit',
      'isbn',
      'kategori',
      'tahun_terbit',
      'lokasi',
      'deskripsi',
      'foto_url'
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    });

    if (body.stok !== undefined) {
      const newStock = Number(body.stok);
      if (Number.isNaN(newStock) || newStock < 0) {
        return res.status(400).json({ success: false, message: 'Stok tidak valid' });
      }

      let newAvailable = undefined;
      if (body.stok_tersedia !== undefined) {
        const requestedAvailable = Number(body.stok_tersedia);
        if (Number.isNaN(requestedAvailable) || requestedAvailable < 0) {
          return res.status(400).json({ success: false, message: 'Stok tersedia tidak valid' });
        }
        newAvailable = Math.min(newStock, requestedAvailable);
      } else {
        const delta = newStock - Number(book.stok || 0);
        const currentAvailable = Number(book.stok_tersedia || 0);
        newAvailable = Math.max(0, Math.min(newStock, currentAvailable + delta));
      }

      updates.stok = newStock;
      updates.stok_tersedia = newAvailable;
    }

    await book.update(updates);
    res.json({ success: true, data: book });
  } catch (error) {
    console.error('❌ updateBuku error:', {
      id: req.params.id,
      body: req.body,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete book
export const deleteBuku = async (req, res) => {
  try {
    const book = await Buku.findByPk(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
    
    await book.destroy();
    res.json({ success: true, message: 'Buku berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
