import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { borrowingAPI } from '../api/api';
import '../styles/AdminPeminjaman.css';

const AdminPeminjaman = () => {
  const navigate = useNavigate();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    fetchBorrowings();
  }, [statusFilter]);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const response = await borrowingAPI.getBorrowingList({ status: statusFilter });
      setBorrowings(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data peminjaman');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id_peminjaman) => {
    try {
      await borrowingAPI.approveBorrowing(id_peminjaman);
      setSuccessMsg('Peminjaman disetujui!');
      fetchBorrowings();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyetujui peminjaman');
    }
  };

  const handleReject = async (id_peminjaman) => {
    if (window.confirm('Yakin ingin menolak peminjaman ini?')) {
      try {
        await borrowingAPI.rejectBorrowing(id_peminjaman);
        setSuccessMsg('Peminjaman ditolak!');
        fetchBorrowings();
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menolak peminjaman');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-peminjaman">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Kembali
      </button>

      <h1>📋 Kelola Peminjaman</h1>

      <div className="filter-section">
        <label htmlFor="status-filter">Filter Status:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="pending">⏳ Menunggu Persetujuan</option>
          <option value="aktif">✅ Aktif</option>
          <option value="dikembalikan">📚 Dikembalikan</option>
          <option value="hilang">❌ Hilang</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMsg && <div className="success-message">{successMsg}</div>}

      {loading ? (
        <div className="loading">Memuat...</div>
      ) : borrowings.length > 0 ? (
        <div className="borrowing-cards">
          {borrowings.map((borrowing) => (
            <div key={borrowing.id_peminjaman} className="borrowing-card">
              <div className="card-header">
                <h3>{borrowing.Buku?.judul}</h3>
                <span className="status-badge" style={{
                  backgroundColor: borrowing.status === 'pending' ? '#ffc107' : 
                                  borrowing.status === 'aktif' ? '#28a745' : '#6c757d'
                }}>
                  {borrowing.status.toUpperCase()}
                </span>
              </div>

              <div className="card-body">
                <p><strong>Penulis:</strong> {borrowing.Buku?.pengarang}</p>
                <p><strong>Member:</strong> {borrowing.Member?.nama} ({borrowing.Member?.email})</p>
                <p><strong>Tanggal Pinjam:</strong> {formatDate(borrowing.tanggal_peminjaman)}</p>
                <p><strong>Tanggal Kembali Rencana:</strong> {formatDate(borrowing.tanggal_kembali_rencana)}</p>
              </div>

              {borrowing.status === 'pending' && (
                <div className="card-actions">
                  <button
                    onClick={() => handleApprove(borrowing.id_peminjaman)}
                    className="btn-approve"
                  >
                    ✓ Setujui
                  </button>
                  <button
                    onClick={() => handleReject(borrowing.id_peminjaman)}
                    className="btn-reject"
                  >
                    ✕ Tolak
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-borrowings">
          Tidak ada peminjaman dengan status {statusFilter}
        </div>
      )}
    </div>
  );
};

export default AdminPeminjaman;
