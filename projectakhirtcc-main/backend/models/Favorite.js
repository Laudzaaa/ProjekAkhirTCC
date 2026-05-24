import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import User from './User.js';
import Vehicle from './Vehicle.js';

const Favorite = db.define('favorites', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

Vehicle.hasMany(Favorite, { foreignKey: 'vehicle_id' });
Favorite.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

export default Favorite;
