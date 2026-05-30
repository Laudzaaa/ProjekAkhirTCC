import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Member = db.define('Member', {
  id_member: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  nomor_identitas: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true
  },
  nomor_hp: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('aktif', 'nonaktif', 'suspended'),
    defaultValue: 'aktif'
  },
  role: {
    type: DataTypes.ENUM('member', 'admin', 'superadmin'),
    defaultValue: 'member'
  },
  tanggal_bergabung: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'members',
  timestamps: true,
  underscored: true
});

export default Member;
