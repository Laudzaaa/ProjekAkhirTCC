import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { borrowingAPI } from '../api/api';
import '../styles/RiwayatPeminjaman.css';

const RiwayatPeminjaman = () => {
  const navigate = useNavigate();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBorrowings();
  }, []);

  const fetchMyBorrowings = async () => {
    try {
      setLoading(true);
      const response = await borrowingAPI.getMyBorrowings();
      setBorrowings(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat riwayat peminjaman');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: '⏳ Menunggu', color: '#ffc107' },
      aktif: { label: '✅ Dipinjam', color: '#28a745' },
      dikembalikan: { label: '📚 Dikembalikan', color: '#6c757d' },
      hilang: { label: '❌ Hilang', color: '#dc3545' }
    };
    return statusMap[status] || { label: status, color: '#6c757d' };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="riwayat-peminjaman">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Kembali
      </button>

      <h1>📖 Riwayat Peminjaman</h1>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Memuat...</div>
      ) : borrowings.length > 0 ? (
        <div className="borrowing-table">
          <table>
            <thead>
              <tr>
                <th>Judul Buku</th>
                <th>Penulis</th>
                <th>Status</th>
                <th>Tanggal Pinjam</th>
                <th>Tanggal Kembali Rencana</th>
                <th>Denda</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map((borrowing) => {
                const status = getStatusBadge(borrowing.status);
                return (
                  <tr key={borrowing.id_peminjaman}>
                    <td>{borrowing.Buku?.judul || 'N/A'}</td>
                    <td>{borrowing.Buku?.pengarang || 'N/A'}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td>{formatDate(borrowing.tanggal_peminjaman)}</td>
                    <td>{formatDate(borrowing.tanggal_kembali_rencana)}</td>
                    <td>Rp {borrowing.denda || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-borrowings">
          Anda belum meminjam buku apapun
        </div>
      )}
    </div>
  );
};

export default RiwayatPeminjaman;
