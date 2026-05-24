import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Vehicle = db.define('vehicles', {
  type: {
    type: DataTypes.ENUM('mobil', 'motor'),
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  plate_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  price_per_day: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'rented'),
    defaultValue: 'available'
  },
  image_url: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default Vehicle;
