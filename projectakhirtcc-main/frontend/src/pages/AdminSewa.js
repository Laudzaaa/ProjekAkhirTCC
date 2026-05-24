import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AdminSewa = () => {
  const [rentals, setRentals] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/rentals/admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRentals(res.data);
      } catch (err) {
        toast.error('Gagal memuat data penyewaan');
      }
    };
    fetchRentals();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    const confirm = await Swal.fire({
      title: 'Ubah status?',
      text: `Status akan diubah menjadi ${newStatus}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, ubah',
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await api.put(`/rentals/${id}`, { status: newStatus }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Status berhasil diperbarui');
        setRentals(prev =>
          prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
        );
      } catch {
        toast.error('Gagal mengubah status');
      }
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Hapus data sewa?',
      text: 'Tindakan ini tidak dapat dibatalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/rentals/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Data sewa berhasil dihapus');
        setRentals(prev => prev.filter(r => r.id !== id));
      } catch {
        toast.error('Gagal menghapus data sewa');
      }
    }
  };

  const filteredRentals = rentals.filter(r =>
    r.user?.name?.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || r.status === statusFilter)
  );

  return (
    <div style={styles.container}>
      {/* Navbar Sticky */}
      <div style={styles.navbar}>
        <FaArrowLeft size={20} onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        <span style={styles.navTitle}>Manajemen Penyewaan</span>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Cari nama user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      {/* Filter */}
      <div style={styles.filterMenu}>
        {['all', 'booked', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={statusFilter === status ? styles.activeBtn : styles.btn}
          >
            {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {filteredRentals.length === 0 ? (
        <p style={styles.text}>Belum ada penyewaan</p>
      ) : (
        <div style={styles.grid}>
          {filteredRentals.map((rental) => (
            <div key={rental.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{rental.vehicle?.brand} {rental.vehicle?.model}</h3>
              <p>Nama: <strong>{rental.user?.name}</strong></p>
              <p>Tanggal: {rental.start_date} → {rental.end_date}</p>
              <p>Total: Rp{parseInt(rental.total_price).toLocaleString()}</p>
              <p>Status: <strong>{rental.status.toUpperCase()}</strong></p>
              <div style={styles.actions}>
                {rental.status !== 'completed' && (
                  <button
                    style={styles.greenBtn}
                    onClick={() => handleUpdateStatus(rental.id, 'completed')}
                  >
                    ✔ Selesai
                  </button>
                )}
                {rental.status !== 'cancelled' && (
                  <button
                    style={styles.orangeBtn}
                    onClick={() => handleUpdateStatus(rental.id, 'cancelled')}
                  >
                    ✖ Batal
                  </button>
                )}
                <button
                  style={styles.redBtn}
                  onClick={() => handleDelete(rental.id)}
                >
                  🗑 Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f0f1a',
    color: '#fff',
    padding: '100px 20px 30px',
  },
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    background: '#0f0f1a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 20px',
    zIndex: 999,
    boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: "'Orbitron', sans-serif"
  },
  searchContainer: {
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  filterMenu: {
    display: 'flex',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 30,
    flexWrap: 'wrap'
  },
  btn: {
    background: '#333',
    color: '#fff',
    border: '1px solid #555',
    padding: '10px 20px',
    borderRadius: 10,
    cursor: 'pointer'
  },
  activeBtn: {
    background: 'linear-gradient(to right, #ff0080, #7928ca)',
    color: '#fff',
    border: '1px solid #7928ca',
    padding: '10px 20px',
    borderRadius: 10,
    cursor: 'pointer'
  },
  search: {
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #555',
    background: '#2e2e3a',
    color: '#fff',
    minWidth: 250,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
  },
  card: {
    background: '#1e1e2f',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    transition: '0.3s ease',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 12,
    flexWrap: 'wrap'
  },
  greenBtn: {
    background: 'limegreen',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  orangeBtn: {
    background: '#ffa500',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  redBtn: {
    background: '#d33',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
    opacity: 0.8
  }
};

export default AdminSewa;
