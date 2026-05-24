import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookAPI, borrowingAPI } from '../api/api';
import '../styles/BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await bookAPI.getBookById(id);
      setBook(response.data.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    try {
      setBorrowing(true);
      await borrowingAPI.createBorrowing({
        id_buku: id,
        tanggal_kembali_rencana: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      alert('✅ Buku berhasil dipinjam!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('❌ Gagal meminjam buku: ' + error.response?.data?.message || error.message);
    } finally {
      setBorrowing(false);
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
          {book.foto_url ? (
            <img src={book.foto_url} alt={book.judul} />
          ) : (
            <div className="book-placeholder-large">📕</div>
          )}
        </div>

        <div className="book-info-section">
          <h1>{book.judul}</h1>
          <p className="author">Penulis: {book.pengarang}</p>
          <p>Penerbit: {book.penerbit}</p>
          {book.isbn && <p>ISBN: {book.isbn}</p>}
          <p>Kategori: {book.kategori}</p>
          <p>Tahun Terbit: {book.tahun_terbit}</p>
          <p>Stok Tersedia: {book.stok_tersedia}/{book.stok}</p>

          <div className="book-actions">
            <button
              onClick={handleBorrow}
              disabled={borrowing || book.stok_tersedia === 0}
              className="btn-primary"
            >
              {borrowing ? '⏳ Meminjam...' : '📖 Pinjam Buku'}
            </button>
          </div>

          <div className="book-description">
            <h3>Deskripsi</h3>
            <p>{book.deskripsi || 'Tidak ada deskripsi'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
