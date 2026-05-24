import { db, auth } from '../config/firebase.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/tokenManager.js';

/**
 * Register User
 */
export const registerUser = async (req, res) => {
  try {
    const { email, password, fullName, role = 'user' } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, dan fullName harus diisi',
      });
    }

    // Check if user already exists
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (!userSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Firebase Auth user
    const firebaseUser = await auth.createUser({
      email: email,
      password: password,
      displayName: fullName,
    });

    // Save user to Firestore
    await db.collection('users').doc(firebaseUser.uid).set({
      uid: firebaseUser.uid,
      email: email,
      fullName: fullName,
      password: hashedPassword,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date(),
      profilePicture: null,
      bio: '',
      isActive: true,
    });

    // Generate token
    const token = generateToken(firebaseUser.uid, email, role);

    res.status(201).json({
      success: true,
      message: 'User berhasil didaftarkan',
      data: {
        uid: firebaseUser.uid,
        email: email,
        fullName: fullName,
        token: token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal mendaftarkan user: ${error.message}`,
    });
  }
};

/**
 * Login User
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password harus diisi',
      });
    }

    // Find user by email
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    // Generate token
    const token = generateToken(userData.uid, userData.email, userData.role);

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        uid: userData.uid,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        token: token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal login: ${error.message}`,
    });
  }
};

/**
 * Get User Profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    const userData = userDoc.data();
    delete userData.password;

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal mengambil profil: ${error.message}`,
    });
  }
};

/**
 * Update User Profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { fullName, bio, profilePicture } = req.body;

    await db.collection('users').doc(uid).update({
      fullName: fullName || '',
      bio: bio || '',
      profilePicture: profilePicture || null,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal memperbarui profil: ${error.message}`,
    });
  }
};

/**
 * Get All Users (Admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map((doc) => {
      const userData = doc.data();
      delete userData.password;
      return userData;
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal mengambil daftar user: ${error.message}`,
    });
  }
};

/**
 * Delete User (Admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;

    // Delete from Firestore
    await db.collection('users').doc(uid).delete();

    // Delete from Firebase Auth
    await auth.deleteUser(uid);

    res.status(200).json({
      success: true,
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal menghapus user: ${error.message}`,
    });
  }
};
