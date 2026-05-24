// =====================================
// 🚗 Rental Vehicle API Models
// =====================================
import User from './User.js';
import Vehicle from './Vehicle.js';
import Rental from './Rental.js';
import Payment from './Payment.js';
import Review from './Review.js';
import Favorite from './Favorite.js';

// =====================================
// 📚 Library API Models
// =====================================
import Buku from './Buku.js';
import Member from './Member.js';
import Peminjaman from './Peminjaman.js';
import Pengembalian from './Pengembalian.js';

// =====================
// 📦 ASSOCIATIONS
// =====================

// User ↔ Rental
User.hasMany(Rental, { foreignKey: 'user_id' });
Rental.belongsTo(User, { foreignKey: 'user_id' });

// Vehicle ↔ Rental
Vehicle.hasMany(Rental, { foreignKey: 'vehicle_id' });
Rental.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

// Rental ↔ Payment
Rental.hasOne(Payment, { foreignKey: 'rental_id' });
Payment.belongsTo(Rental, { foreignKey: 'rental_id' });

// Vehicle ↔ Review
Vehicle.hasMany(Review, { foreignKey: 'vehicle_id' });
Review.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

// User ↔ Review
User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

// =====================
// 🧡 User ↔ Favorite ↔ Vehicle
// =====================

// User ↔ Favorite
User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

// Vehicle ↔ Favorite
Vehicle.hasMany(Favorite, { foreignKey: 'vehicle_id' });
Favorite.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

// =====================================
// 📚 Library API Associations
// =====================================

// Member ↔ Peminjaman
Member.hasMany(Peminjaman, { foreignKey: 'id_member' });
Peminjaman.belongsTo(Member, { foreignKey: 'id_member' });

// Buku ↔ Peminjaman
Buku.hasMany(Peminjaman, { foreignKey: 'id_buku' });
Peminjaman.belongsTo(Buku, { foreignKey: 'id_buku' });

// Peminjaman ↔ Pengembalian
Peminjaman.hasOne(Pengembalian, { foreignKey: 'id_peminjaman' });
Pengembalian.belongsTo(Peminjaman, { foreignKey: 'id_peminjaman' });

export {
  // Rental Vehicle API
  User,
  Vehicle,
  Rental,
  Payment,
  Review,
  Favorite,
  // Library API
  Buku,
  Member,
  Peminjaman,
  Pengembalian
};
