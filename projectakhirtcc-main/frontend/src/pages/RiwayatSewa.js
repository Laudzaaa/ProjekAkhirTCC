import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const RiwayatSewa = () => {
  const [rentals, setRentals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [reviewedVehicleIds, setReviewedVehicleIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Ambil riwayat sewa
        const resRentals = await api.get('/rentals', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRentals(resRentals.data);

        // Ambil semua review dari user
        const resReviews = await api.get('/reviews/my-reviews', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ids = resReviews.data.map(r => r.vehicle_id);
        setReviewedVehicleIds(ids);
      } catch {
        toast.error('❌ Gagal mengambil data riwayat atau review');
      }
    };
    fetchData();
  }, []);

  const handleReview = (vehicleId) => {
    navigate(`/review/${vehicleId}`);
  };

  const filteredRentals = filter === 'all'
    ? rentals
    : rentals.filter(r => r.status === filter);

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <FaArrowLeft size={20} onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        <span style={styles.navTitle}>Riwayat Sewa</span>
      </div>

      <div style={styles.filterMenu}>
        {['all', 'booked', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            style={filter === status ? styles.activeBtn : styles.btn}
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredRentals.length === 0 ? (
        <p style={styles.loading}>Belum ada riwayat sewa.</p>
      ) : (
        <div style={styles.grid}>
          {filteredRentals.map(r => (
            <div key={r.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{r.vehicle?.brand} {r.vehicle?.model}</h3>
              <p><strong>Tanggal:</strong> {r.start_date} → {r.end_date}</p>
              <p><strong>Total:</strong> Rp{parseInt(r.total_price).toLocaleString()}</p>
              <p><strong>Status:</strong>{' '}
                <span style={{
                  fontWeight: 'bold',
                  color: r.status === 'completed'
                    ? 'limegreen'
                    : r.status === 'cancelled'
                      ? 'tomato'
                      : '#ffc107'
                }}>
                  {r.status.toUpperCase()}
                </span>
              </p>
              {r.status === 'completed' && !reviewedVehicleIds.includes(r.vehicle_id) && (
                <button onClick={() => handleReview(r.vehicle_id)} style={styles.reviewBtn}>
                  ✍️ Tulis Review
                </button>
              )}
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
    padding: '100px 20px 30px',
    background: '#0f0f1a',
    color: '#fff'
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
  filterMenu: {
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 30
  },
  btn: {
    background: '#333',
    color: '#fff',
    border: '1px solid #555',
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer'
  },
  activeBtn: {
    background: 'linear-gradient(to right, #ff0080, #7928ca)',
    color: '#fff',
    border: '1px solid #7928ca',
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gap: 20,
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
  },
  card: {
    background: '#1e1e2f',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 120,
    fontSize: 16
  },
  reviewBtn: {
    marginTop: 10,
    background: 'linear-gradient(to right, #ff0080, #7928ca)',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default RiwayatSewa;
