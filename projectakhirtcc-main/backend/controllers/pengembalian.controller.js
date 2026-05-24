import { Pengembalian, Peminjaman, Member, Buku } from '../models/index.js';

// ✅ Create pengembalian record
export const createPengembalian = async (req, res) => {
  try {
    const { id_peminjaman, kondisi_buku = 'baik', catatan = '', denda_keterlambatan = 0, denda_kerusakan = 0 } = req.body;

    // Check if peminjaman exists
    const peminjaman = await Peminjaman.findByPk(id_peminjaman);
    if (!peminjaman) {
      return res.status(404).json({ success: false, message: 'Peminjaman tidak ditemukan' });
    }

    // Check if already returned
    if (peminjaman.status !== 'aktif') {
      return res.status(400).json({ success: false, message: 'Buku sudah dikembalikan atau hilang' });
    }

    const total_denda = denda_keterlambatan + denda_kerusakan;

    // Create pengembalian record
    const pengembalian = await Pengembalian.create({
      id_peminjaman,
      tanggal_pengembalian: new Date(),
      kondisi_buku,
      catatan,
      denda_keterlambatan,
      denda_kerusakan,
      total_denda,
      status_pembayaran_denda: total_denda === 0 ? 'tidak_ada_denda' : 'belum_dibayar'
    });

    // Update peminjaman status
    await peminjaman.update({
      tanggal_kembali_aktual: new Date(),
      status: kondisi_buku === 'hilang' ? 'hilang' : 'dikembalikan',
      denda: total_denda
    });

    // Update book stock if not hilang
    if (kondisi_buku !== 'hilang') {
      const buku = await Buku.findByPk(peminjaman.id_buku);
      await buku.update({ stok_tersedia: buku.stok_tersedia + 1 });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Pengembalian berhasil dicatat',
      data: pengembalian 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get pengembalian list
export const getPengembalianList = async (req, res) => {
  try {
    const { status_pembayaran } = req.query;
    
    let where = {};
    if (status_pembayaran) where.status_pembayaran_denda = status_pembayaran;

    const pengembalians = await Pengembalian.findAll({
      where,
      include: [
        {
          model: Peminjaman,
          include: [
            { model: Member, attributes: ['id_member', 'nama', 'email'] },
            { model: Buku, attributes: ['id_buku', 'judul', 'pengarang'] }
          ]
        }
      ],
      order: [['tanggal_pengembalian', 'DESC']]
    });

    res.json({ success: true, data: pengembalians });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get pengembalian by ID
export const getPengembalianById = async (req, res) => {
  try {
    const pengembalian = await Pengembalian.findByPk(req.params.id, {
      include: [
        {
          model: Peminjaman,
          include: [
            { model: Member, attributes: ['id_member', 'nama', 'email', 'nomor_hp'] },
            { model: Buku, attributes: ['id_buku', 'judul', 'pengarang', 'penerbit'] }
          ]
        }
      ]
    });

    if (!pengembalian) {
      return res.status(404).json({ success: false, message: 'Pengembalian tidak ditemukan' });
    }

    res.json({ success: true, data: pengembalian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get my pengembalian history (member)
export const getMyPengembalian = async (req, res) => {
  try {
    const id_member = req.user.id_member;

    const pengembalians = await Pengembalian.findAll({
      include: [
        {
          model: Peminjaman,
          where: { id_member },
          include: [
            { model: Buku, attributes: ['id_buku', 'judul', 'pengarang'] }
          ]
        }
      ],
      order: [['tanggal_pengembalian', 'DESC']]
    });

    res.json({ success: true, data: pengembalians });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Mark denda as paid
export const markDendaPaid = async (req, res) => {
  try {
    const pengembalian = await Pengembalian.findByPk(req.params.id);
    if (!pengembalian) {
      return res.status(404).json({ success: false, message: 'Pengembalian tidak ditemukan' });
    }

    if (pengembalian.total_denda === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada denda yang harus dibayar' });
    }

    await pengembalian.update({
      status_pembayaran_denda: 'dibayar'
    });

    res.json({ 
      success: true, 
      message: 'Denda berhasil dibayar',
      data: pengembalian 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get pengembalian statistics
export const getPengembalianStats = async (req, res) => {
  try {
    const total = await Pengembalian.count();
    const belum_dibayar = await Pengembalian.count({ where: { status_pembayaran_denda: 'belum_dibayar' } });
    const dibayar = await Pengembalian.count({ where: { status_pembayaran_denda: 'dibayar' } });
    const tidak_ada_denda = await Pengembalian.count({ where: { status_pembayaran_denda: 'tidak_ada_denda' } });

    // Total denda collected
    const result = await Pengembalian.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_denda')), 'total_denda_terkumpul']
      ],
      raw: true
    });

    const total_denda_terkumpul = result[0]?.total_denda_terkumpul || 0;

    res.json({ 
      success: true, 
      data: {
        total,
        belum_dibayar,
        dibayar,
        tidak_ada_denda,
        total_denda_terkumpul
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
