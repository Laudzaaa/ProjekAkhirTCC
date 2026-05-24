import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Pengembalian = db.define('Pengembalian', {
  id_pengembalian: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_peminjaman: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'peminjamans',
      key: 'id_peminjaman'
    }
  },
  tanggal_pengembalian: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  kondisi_buku: {
    type: DataTypes.ENUM('baik', 'rusak_ringan', 'rusak_berat', 'hilang'),
    defaultValue: 'baik'
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  denda_keterlambatan: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  denda_kerusakan: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total_denda: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  status_pembayaran_denda: {
    type: DataTypes.ENUM('belum_dibayar', 'dibayar', 'tidak_ada_denda'),
    defaultValue: 'tidak_ada_denda'
  }
}, {
  tableName: 'pengembalians',
  timestamps: true,
  underscored: true
});

export default Pengembalian;
