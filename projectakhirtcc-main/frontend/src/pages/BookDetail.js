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
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [tanggalPinjam, setTanggalPinjam] = useState(new Date().toISOString().split('T')[0]);
  const [tanggalKembali, setTanggalKembali] = useState('');
  const [selectedDays, setSelectedDays] = useState(0);

  const rawUser = localStorage.getItem('user');
  let user = null;

  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    user = null;
  }

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

  // Calculate days between two dates
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  // Update selected days when dates change
  useEffect(() => {
    const days = calculateDays(tanggalPinjam, tanggalKembali);
    setSelectedDays(days);
  }, [tanggalPinjam, tanggalKembali]);

  // Open borrow modal
  const handleBorrow = () => {
    setShowBorrowModal(true);
    const defaultReturn = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setTanggalKembali(defaultReturn);
  };

  // Close borrow modal
  const handleCloseBorrowModal = () => {
    setShowBorrowModal(false);
    setTanggalPinjam(new Date().toISOString().split('T')[0]);
    setTanggalKembali('');
    setSelectedDays(0);
  };

  // Submit borrowing request
  const handleConfirmBorrow = async () => {
    try {
      if (!tanggalKembali) {
        alert('❌ Tanggal kembali harus diisi');
        return;
      }

      if (new Date(tanggalKembali) <= new Date(tanggalPinjam)) {
        alert('❌ Tanggal kembali harus setelah tanggal pinjam');
        return;
      }

      setBorrowing(true);
      await borrowingAPI.createBorrowing({
        id_buku: id,
        tanggal_peminjaman: tanggalPinjam,
        tanggal_kembali_rencana: tanggalKembali,
      });
      
      alert(`✅ Permintaan peminjaman berhasil dibuat!\n\nDurasi: ${selectedDays} hari\nMenunggu persetujuan dari admin.`);
      handleCloseBorrowModal();
      navigate('/riwayat-peminjaman');
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
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate(`/admin/edit-buku/${book.id_buku || id}`)}
                className="btn-secondary"
              >
                ✏️ Edit Buku
              </button>
            )}
          </div>

          <div className="book-description">
            <h3>Deskripsi</h3>
            <p>{book.deskripsi || 'Tidak ada deskripsi'}</p>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      {showBorrowModal && (
        <div className="modal-overlay" onClick={handleCloseBorrowModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📖 Pinjam Buku</h2>
              <button className="modal-close" onClick={handleCloseBorrowModal}>✕</button>
            </div>

            <div className="modal-body">
              <p className="book-title-modal">{book.judul}</p>

              <div className="form-group">
                <label>Tanggal Pinjam:</label>
                <input
                  type="date"
                  value={tanggalPinjam}
                  onChange={(e) => setTanggalPinjam(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Tanggal Kembali:</label>
                <input
                  type="date"
                  value={tanggalKembali}
                  onChange={(e) => setTanggalKembali(e.target.value)}
                  min={tanggalPinjam}
                />
              </div>

              <div className="duration-info">
                <strong>Durasi Peminjaman:</strong>
                <span>{selectedDays} hari</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={handleCloseBorrowModal}
                className="btn-cancel"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmBorrow}
                disabled={borrowing || !tanggalKembali}
                className="btn-confirm"
              >
                {borrowing ? '⏳ Mengirim...' : '✓ Kirim Permohonan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
