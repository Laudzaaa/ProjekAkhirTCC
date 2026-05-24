import { Peminjaman, Buku, Member } from '../models/index.js';
import { Op } from 'sequelize';

// ✅ Create new peminjaman (borrow book)
export const createPeminjaman = async (req, res) => {
  try {
    const { id_buku, durasi_hari = 7 } = req.body;
    const id_member = req.user.id_member;

    // Check if book exists
    const buku = await Buku.findByPk(id_buku);
    if (!buku) {
      return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
    }

    // Check stock availability
    if (buku.stok_tersedia <= 0) {
      return res.status(400).json({ success: false, message: 'Stok buku tidak tersedia' });
    }

    // Calculate return date
    const tanggal_peminjaman = new Date();
    const tanggal_kembali_rencana = new Date();
    tanggal_kembali_rencana.setDate(tanggal_kembali_rencana.getDate() + durasi_hari);

    // Create peminjaman record
    const peminjaman = await Peminjaman.create({
      id_member,
      id_buku,
      tanggal_peminjaman,
      tanggal_kembali_rencana,
      status: 'aktif'
    });

    // Update stok_tersedia
    await buku.update({ stok_tersedia: buku.stok_tersedia - 1 });

    res.status(201).json({ 
      success: true, 
      message: 'Peminjaman berhasil dibuat',
      data: peminjaman 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get peminjaman list
export const getPeminjamanList = async (req, res) => {
  try {
    const { status, id_member } = req.query;
    
    let where = {};
    if (status) where.status = status;
    if (id_member) where.id_member = id_member;

    const peminjamans = await Peminjaman.findAll({
      where,
      include: [
        { model: Member, attributes: ['id_member', 'nama', 'email'] },
        { model: Buku, attributes: ['id_buku', 'judul', 'pengarang'] }
      ],
      order: [['tanggal_peminjaman', 'DESC']]
    });

    res.json({ success: true, data: peminjamans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get my peminjaman (member)
export const getMyPeminjaman = async (req, res) => {
  try {
    const id_member = req.user.id_member;

    const peminjamans = await Peminjaman.findAll({
      where: { id_member },
      include: [
        { model: Buku, attributes: ['id_buku', 'judul', 'pengarang', 'penerbit'] }
      ],
      order: [['tanggal_peminjaman', 'DESC']]
    });

    res.json({ success: true, data: peminjamans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get peminjaman by ID
export const getPeminjamanById = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findByPk(req.params.id, {
      include: [
        { model: Member, attributes: ['id_member', 'nama', 'email', 'nomor_hp'] },
        { model: Buku, attributes: ['id_buku', 'judul', 'pengarang', 'penerbit'] }
      ]
    });

    if (!peminjaman) {
      return res.status(404).json({ success: false, message: 'Peminjaman tidak ditemukan' });
    }

    res.json({ success: true, data: peminjaman });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Calculate denda (fine)
const calculateDenda = (tanggal_kembali_rencana) => {
  const denda_per_hari = 5000; // Rp 5000 per day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const rencana = new Date(tanggal_kembali_rencana);
  rencana.setHours(0, 0, 0, 0);

  const selisih_hari = Math.floor((today - rencana) / (1000 * 60 * 60 * 24));
  
  return selisih_hari > 0 ? selisih_hari * denda_per_hari : 0;
};

// ✅ Mark peminjaman as returned (creates pengembalian record)
export const markPeminjamanReturned = async (req, res) => {
  try {
    const { kondisi_buku = 'baik', catatan = '' } = req.body;
    
    const peminjaman = await Peminjaman.findByPk(req.params.id);
    if (!peminjaman) {
      return res.status(404).json({ success: false, message: 'Peminjaman tidak ditemukan' });
    }

    // Calculate fines
    const denda_keterlambatan = calculateDenda(peminjaman.tanggal_kembali_rencana);
    let denda_kerusakan = 0;

    // Kerusakan charges
    if (kondisi_buku === 'rusak_ringan') denda_kerusakan = 25000;
    else if (kondisi_buku === 'rusak_berat') denda_kerusakan = 100000;
    else if (kondisi_buku === 'hilang') denda_kerusakan = 200000;

    // Update peminjaman
    await peminjaman.update({
      tanggal_kembali_aktual: new Date(),
      status: kondisi_buku === 'hilang' ? 'hilang' : 'dikembalikan',
      denda: denda_keterlambatan + denda_kerusakan
    });

    // Update book stock
    const buku = await Buku.findByPk(peminjaman.id_buku);
    if (kondisi_buku !== 'hilang') {
      await buku.update({ stok_tersedia: buku.stok_tersedia + 1 });
    }

    res.json({ 
      success: true, 
      message: 'Pengembalian dicatat',
      data: {
        peminjaman,
        denda: {
          keterlambatan: denda_keterlambatan,
          kerusakan: denda_kerusakan,
          total: denda_keterlambatan + denda_kerusakan
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get peminjaman statistics
export const getPeminjamanStats = async (req, res) => {
  try {
    const total = await Peminjaman.count();
    const aktif = await Peminjaman.count({ where: { status: 'aktif' } });
    const dikembalikan = await Peminjaman.count({ where: { status: 'dikembalikan' } });
    const hilang = await Peminjaman.count({ where: { status: 'hilang' } });

    res.json({ 
      success: true, 
      data: {
        total,
        aktif,
        dikembalikan,
        hilang
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
