import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Rental = db.define('rentals', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('booked', 'cancelled', 'completed'),
    defaultValue: 'booked'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default Rental;
