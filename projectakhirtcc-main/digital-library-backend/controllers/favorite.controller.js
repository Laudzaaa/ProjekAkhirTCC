import { db } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Add Book to Favorites
 */
export const addFavorite = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.uid;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: 'bookId harus diisi',
      });
    }

    // Check if book exists
    const bookDoc = await db.collection('books').doc(bookId).get();
    if (!bookDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Buku tidak ditemukan',
      });
    }

    // Check if already favorited
    const favoriteSnapshot = await db
      .collection('favorites')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    if (!favoriteSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: 'Buku sudah ada di favorit',
      });
    }

    const favoriteId = uuidv4();
    await db.collection('favorites').doc(favoriteId).set({
      id: favoriteId,
      userId: userId,
      bookId: bookId,
      addedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Buku ditambahkan ke favorit',
      data: {
        favoriteId: favoriteId,
      },
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal menambah favorit: ${error.message}`,
    });
  }
};

/**
 * Remove Book from Favorites
 */
export const removeFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.uid;

    const favoriteSnapshot = await db
      .collection('favorites')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    if (favoriteSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'Favorit tidak ditemukan',
      });
    }

    const favoriteDoc = favoriteSnapshot.docs[0];
    await db.collection('favorites').doc(favoriteDoc.id).delete();

    res.status(200).json({
      success: true,
      message: 'Buku dihapus dari favorit',
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal menghapus favorit: ${error.message}`,
    });
  }
};

/**
 * Get User's Favorites
 */
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.uid;

    const favoritesSnapshot = await db
      .collection('favorites')
      .where('userId', '==', userId)
      .get();

    const favoriteIds = favoritesSnapshot.docs.map((doc) => doc.data().bookId);

    // Get book details
    let books = [];
    for (const bookId of favoriteIds) {
      const bookDoc = await db.collection('books').doc(bookId).get();
      if (bookDoc.exists) {
        books.push(bookDoc.data());
      }
    }

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal mengambil favorit: ${error.message}`,
    });
  }
};

/**
 * Check if Book is Favorite
 */
export const isFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.uid;

    const favoriteSnapshot = await db
      .collection('favorites')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    res.status(200).json({
      success: true,
      data: {
        isFavorite: !favoriteSnapshot.empty,
      },
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal mengecek favorit: ${error.message}`,
    });
  }
};
