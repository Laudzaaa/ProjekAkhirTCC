import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const RiwayatPembayaran = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/payments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(res.data);
      } catch {
        toast.error('❌ Gagal mengambil data pembayaran');
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = filter === 'all'
    ? payments
    : payments.filter(p => p.status === filter);

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <FaArrowLeft size={20} onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        <span style={styles.navTitle}>Riwayat Pembayaran</span>
      </div>

      {/* Filter Buttons */}
      <div style={styles.filterMenu}>
        {['all', 'pending', 'paid', 'failed'].map(status => (
          <button
            key={status}
            style={filter === status ? styles.activeBtn : styles.btn}
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredPayments.length === 0 ? (
        <p style={styles.loading}>💤 Belum ada pembayaran yang tercatat.</p>
      ) : (
        <div style={styles.grid}>
          {filteredPayments.map((p) => (
            <div key={p.id} style={styles.card}>
              <h3 style={styles.cardTitle}>
                {p.rental?.vehicle?.brand} {p.rental?.vehicle?.model}
              </h3>
              <p><strong>Tanggal Sewa:</strong><br />{p.rental?.start_date} → {p.rental?.end_date}</p>
              <p><strong>Metode:</strong> {formatMethod(p.payment_method)}</p>
              <p><strong>Jumlah:</strong> Rp{parseInt(p.amount).toLocaleString()}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span style={{
                  color:
                    p.status === 'paid' ? 'limegreen' :
                    p.status === 'failed' ? 'tomato' : '#ffc107',
                  fontWeight: 'bold'
                }}>
                  {p.status.toUpperCase()}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const formatMethod = (method) => {
  if (method === 'cash') return 'Cash';
  if (method === 'transfer') return 'Transfer Bank';
  if (method === 'ewallet') return 'E-Wallet';
  return method;
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f0f1a',
    color: '#fff',
    padding: '100px 20px 30px'
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
    padding: 22,
    borderRadius: 14,
    boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
    lineHeight: 1.6
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 120
  }
};

export default RiwayatPembayaran;
