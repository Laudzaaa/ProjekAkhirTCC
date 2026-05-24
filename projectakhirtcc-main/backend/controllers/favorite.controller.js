import Favorite from '../models/Favorite.js';
import Vehicle from '../models/Vehicle.js';

export const toggleFavorite = async (req, res) => {
  const { vehicleId } = req.params;
  const userId = req.userId;

  const existing = await Favorite.findOne({ where: { user_id: userId, vehicle_id: vehicleId } });

  if (existing) {
    await existing.destroy();
    return res.json({ message: 'Favorite dihapus.' });
  }

  await Favorite.create({ user_id: userId, vehicle_id: vehicleId });
  return res.json({ message: 'Ditambahkan ke favorite.' });
};

export const getMyFavorites = async (req, res) => {
  const favorites = await Favorite.findAll({
    where: { user_id: req.userId },
    include: [{ model: Vehicle }]
  });
  res.json(favorites);
};

export const getTotalFavorites = async (req, res) => {
  const count = await Favorite.count({ where: { user_id: req.userId } });
  res.json({ total: count });
};
