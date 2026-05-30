import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Peminjaman = db.define('Peminjaman', {
  id_peminjaman: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_member: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'members',
      key: 'id_member'
    }
  },
  id_buku: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bukus',
      key: 'id_buku'
    }
  },
  tanggal_peminjaman: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  tanggal_kembali_rencana: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tanggal_kembali_aktual: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'aktif', 'dikembalikan', 'hilang'),
    defaultValue: 'pending'
  },
  denda: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  tableName: 'peminjamans',
  timestamps: true,
  underscored: true
});

export default Peminjaman;
