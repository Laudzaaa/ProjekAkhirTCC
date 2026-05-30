import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'your-secret-key';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('❌ JWT Verification Error:', err.message, 'Secret:', JWT_SECRET);
      return res.status(403).json({ message: 'Token tidak valid' });
    }
    req.user = user;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Hanya admin yang diizinkan' });
  }
  next();
};
