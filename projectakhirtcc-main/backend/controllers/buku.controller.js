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
    
    await book.update(req.body);
    res.json({ success: true, data: book });
  } catch (error) {
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
