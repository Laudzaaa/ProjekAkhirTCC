import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookAPI, favoriteAPI, reviewAPI } from '../api/api';
import '../styles/BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBook();
    checkFavorite();
    fetchReviews();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await bookAPI.getBookById(id);
      setBook(response.data.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getReviewsByBook(id);
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await favoriteAPI.isFavorite(id);
      setIsFavorite(response.data.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleAddFavorite = async () => {
    try {
      if (isFavorite) {
        await favoriteAPI.removeFavorite(id);
      } else {
        await favoriteAPI.addFavorite(id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error managing favorite:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await bookAPI.downloadBook(id);
      window.open(response.data.data.downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading book:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await reviewAPI.createReview({
        bookId: id,
        rating,
        comment,
      });
      setRating(5);
      setComment('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Memuat...</div>;
  if (!book) return <div className="error">Buku tidak ditemukan</div>;

  return (
    <div className="book-detail">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Kembali
      </button>

      <div className="book-detail-container">
        <div className="book-cover-section">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} />
          ) : (
            <div className="book-placeholder-large">📕</div>
          )}
        </div>

        <div className="book-info-section">
          <h1>{book.title}</h1>
          <p className="author">Penulis: {book.author}</p>
          {book.isbn && <p>ISBN: {book.isbn}</p>}
          <p>Kategori: {book.category}</p>
          <p>Tahun Terbit: {book.publishYear}</p>

          <div className="book-actions">
            <button
              onClick={handleDownload}
              className="btn-primary"
            >
              📥 Download
            </button>
            <button
              onClick={handleAddFavorite}
              className={`btn-favorite ${isFavorite ? 'favorited' : ''}`}
            >
              {isFavorite ? '❤️ Hapus Favorit' : '🤍 Tambah Favorit'}
            </button>
          </div>

          <div className="book-description">
            <h3>Deskripsi</h3>
            <p>{book.description}</p>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Review & Rating</h2>

        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="form-group">
            <label>Rating:</label>
            <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
              <option value="5">⭐⭐⭐⭐⭐ Sangat Bagus</option>
              <option value="4">⭐⭐⭐⭐ Bagus</option>
              <option value="3">⭐⭐⭐ Cukup</option>
              <option value="2">⭐⭐ Kurang</option>
              <option value="1">⭐ Sangat Kurang</option>
            </select>
          </div>

          <div className="form-group">
            <label>Komentar:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tulis review Anda..."
              rows="5"
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Mengirim...' : 'Kirim Review'}
          </button>
        </form>

        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <strong>{review.userName}</strong>
                  <span className="rating">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p>Belum ada review</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
