import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const RentalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [form, setForm] = useState({
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehicle(res.data);
      } catch {
        toast.error('❌ Gagal mengambil data kendaraan');
        navigate('/dashboard');
      }
    };
    fetchVehicle();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return toast.error('❌ Tanggal tidak valid');

    const total_price = diffDays * parseInt(vehicle.price_per_day);

    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/rentals', {
        vehicle_id: parseInt(id),
        start_date: form.start_date,
        end_date: form.end_date,
        total_price
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const rentalId = res.data.rental.id;

      toast.success('✅ Pemesanan berhasil! Lanjut ke pembayaran...');
      setTimeout(() => {
        navigate(`/pembayaran/${rentalId}`);
      }, 1000);
    } catch (err) {
      toast.error('❌ Gagal melakukan pemesanan');
    }
  };

  if (!vehicle) return <p style={styles.loading}>Memuat data kendaraan...</p>;

  return (
    <div style={styles.container}>
      {/* Sticky Navbar */}
      <div style={styles.navbar}>
        <FaArrowLeft size={20} onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        <span style={styles.navTitle}>Sewa Kendaraan</span>
      </div>

      {/* Form Card */}
      <div style={styles.card}>
        <h2 style={styles.title}>🚘 {vehicle.brand} {vehicle.model}</h2>
        <p style={styles.label}>Harga per hari: <strong>Rp{parseInt(vehicle.price_per_day).toLocaleString()}</strong></p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Konfirmasi Sewa</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f0f1a',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '100px 20px 30px',
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
  card: {
    background: '#1e1e2f',
    padding: 30,
    borderRadius: 16,
    maxWidth: 420,
    width: '100%',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  label: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #555',
    background: '#2e2e3a',
    color: '#fff',
    fontSize: 14
  },
  button: {
    background: 'linear-gradient(to right, #ff0080, #7928ca)',
    padding: 12,
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: 15
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 120,
    fontSize: 16
  }
};

export default RentalForm;
