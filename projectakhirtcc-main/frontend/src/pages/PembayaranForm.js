import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const PembayaranForm = () => {
  const { rental_id } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [form, setForm] = useState({
    payment_method: 'transfer',
    amount: ''
  });

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/rentals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const found = res.data.find(r => r.id === parseInt(rental_id));
        if (!found) return toast.error('❌ Data sewa tidak ditemukan');
        if (found.status !== 'booked') {
          toast.warning('⚠️ Sewa ini sudah tidak aktif untuk pembayaran!');
          return navigate('/riwayat');
        }
        setRental(found);
        setForm(f => ({ ...f, amount: found.total_price }));
      } catch {
        toast.error('❌ Gagal memuat data sewa');
      }
    };

    fetchRental();
  }, [rental_id, navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) {
      return toast.error('❌ Jumlah pembayaran tidak valid');
    }

    try {
      const token = localStorage.getItem('token');
      await api.post('/payments', {
        rental_id: parseInt(rental_id),
        ...form
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Pembayaran berhasil dicatat!');
      setTimeout(() => navigate('/riwayat/pembayaran'), 1200);
    } catch {
      toast.error('❌ Gagal mencatat pembayaran');
    }
  };

  if (!rental) return <p style={styles.loading}>Memuat data sewa...</p>;

  return (
    <div style={styles.container}>
      {/* Sticky Navbar */}
      <div style={styles.navbar}>
        <FaArrowLeft size={20} onClick={() => navigate('/riwayat')} style={{ cursor: 'pointer' }} />
        <span style={styles.navTitle}>Form Pembayaran</span>
      </div>

      {/* Form Card */}
      <div style={styles.card}>
        <h2 style={styles.title}>💳 Pembayaran untuk {rental.vehicle?.brand} {rental.vehicle?.model}</h2>
        <p><strong>Total Harga:</strong> Rp{parseInt(rental.total_price).toLocaleString()}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Metode Pembayaran:</label>
          <select name="payment_method" value={form.payment_method} onChange={handleChange} style={styles.input}>
            <option value="transfer">Transfer Bank</option>
            <option value="ewallet">E-Wallet</option>
            <option value="cash">Cash</option>
          </select>

          <label style={styles.label}>Jumlah Bayar:</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min="1"
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Bayar Sekarang</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f0f1a',
    color: '#fff',
    padding: '100px 20px 30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
  card: {
    background: '#1e1e2f',
    padding: 30,
    borderRadius: 16,
    maxWidth: 500,
    width: '100%',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  },
  label: {
    marginBottom: -8,
    fontSize: 14
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #444',
    background: '#2e2e3a',
    color: '#fff',
    fontSize: 14
  },
  button: {
    marginTop: 12,
    background: 'linear-gradient(to right, #ff0080, #7928ca)',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 120,
    fontSize: 16
  }
};

export default PembayaranForm;
