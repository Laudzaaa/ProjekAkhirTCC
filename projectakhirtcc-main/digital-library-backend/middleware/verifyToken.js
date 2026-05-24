import { verifyToken } from '../utils/tokenManager.js';

/**
 * Middleware untuk verifikasi JWT Token
 */
export const verifyTokenMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan',
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Unauthorized: ${error.message}`,
    });
  }
};

/**
 * Middleware untuk verifikasi role admin
 */
export const verifyAdminRole = async (req, res, next) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin role required',
      });
    }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden',
    });
  }
};

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};
