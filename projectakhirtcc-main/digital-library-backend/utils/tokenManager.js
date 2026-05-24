import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Generate JWT Token
 */
export const generateToken = (userId, userEmail, role = 'user') => {
  return jwt.sign(
    {
      uid: userId,
      email: userEmail,
      role: role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

/**
 * Decode JWT Token (without verification)
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
