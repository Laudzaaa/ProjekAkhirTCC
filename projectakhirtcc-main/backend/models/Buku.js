import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Buku = db.define('Buku', {
  id_buku: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  judul: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  pengarang: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  penerbit: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  isbn: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true
  },
  kategori: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tahun_terbit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  stok: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  stok_tersedia: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lokasi: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  foto_url: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'bukus',
  timestamps: true,
  underscored: true
});

export default Buku;
