import { db } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create Review
 */
export const createReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const userId = req.user.uid;

    if (!bookId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'bookId dan rating harus diisi',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating harus antara 1-5',
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

    // Check if user already reviewed this book
    const reviewSnapshot = await db
      .collection('reviews')
      .where('bookId', '==', bookId)
      .where('userId', '==', userId)
      .get();

    if (!reviewSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah memberikan review untuk buku ini',
      });
    }

    const reviewId = uuidv4();
    await db.collection('reviews').doc(reviewId).set({
      id: reviewId,
      bookId: bookId,
      userId: userId,
      rating: rating,
      comment: comment || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      helpful: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Review berhasil ditambahkan',
      data: {
        reviewId: reviewId,
      },
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal membuat review: ${error.message}`,
    });
  }
};

/**
 * Get Reviews by Book ID
 */
export const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const reviewsSnapshot = await db
      .collection('reviews')
      .where('bookId', '==', bookId)
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = reviewsSnapshot.docs.map((doc) => doc.data());

    // Get user details for each review
    for (let i = 0; i < reviews.length; i++) {
      const userDoc = await db.collection('users').doc(reviews[i].userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        reviews[i].userName = userData.fullName;
        reviews[i].userProfilePicture = userData.profilePicture;
      }
    }

    const total = reviews.length;
    const paginatedReviews = reviews.slice(offset, offset + limit);

    res.status(200).json({
      success: true,
      data: paginatedReviews,
      pagination: {
        total: total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal mengambil review: ${error.message}`,
    });
  }
};

/**
 * Update Review
 */
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.uid;

    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Review tidak ditemukan',
      });
    }

    if (reviewDoc.data().userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak bisa mengubah review orang lain',
      });
    }

    await db.collection('reviews').doc(reviewId).update({
      rating: rating || reviewDoc.data().rating,
      comment: comment || reviewDoc.data().comment,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Review berhasil diperbarui',
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal memperbarui review: ${error.message}`,
    });
  }
};

/**
 * Delete Review
 */
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.uid;

    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Review tidak ditemukan',
      });
    }

    if (reviewDoc.data().userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak bisa menghapus review orang lain',
      });
    }

    await db.collection('reviews').doc(reviewId).delete();

    res.status(200).json({
      success: true,
      message: 'Review berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal menghapus review: ${error.message}`,
    });
  }
};
