import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const TambahKendaraan = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'mobil',
    brand: '',
    model: '',
    plate_number: '',
    price_per_day: '',
    status: 'available',
    image_url: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'admin') {
      alert('❌ Hanya admin yang boleh menambahkan kendaraan!');
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/vehicles', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Kendaraan berhasil ditambahkan!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      alert('❌ Gagal menambahkan kendaraan');
    }
  };

  return (
    <div style={styles.container}>
      {/* Sticky Navbar */}
      <div style={styles.navbar}>
        <FaArrowLeft size={20} onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        <span style={styles.navTitle}>Tambah Kendaraan</span>
      </div>

      {/* Form Card */}
      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
            <option value="mobil">Mobil</option>
            <option value="motor">Motor</option>
          </select>
          <input type="text" name="brand" placeholder="Merk" value={form.brand} onChange={handleChange} required style={styles.input} />
          <input type="text" name="model" placeholder="Model" value={form.model} onChange={handleChange} required style={styles.input} />
          <input type="text" name="plate_number" placeholder="Plat Nomor" value={form.plate_number} onChange={handleChange} required style={styles.input} />
          <input type="number" name="price_per_day" placeholder="Harga per hari" value={form.price_per_day} onChange={handleChange} required style={styles.input} />
          <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
            <option value="available">Tersedia</option>
            <option value="rented">Disewa</option>
          </select>
          <input type="text" name="image_url" placeholder="URL Gambar" value={form.image_url} onChange={handleChange} required style={styles.input} />
          <button type="submit" style={styles.button}>Simpan</button>
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
    width: '100%',
    maxWidth: 500,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #444',
    background: '#2e2e3a',
    color: '#fff',
    fontSize: 14
  },
  button: {
    marginTop: 10,
    background: 'linear-gradient(to right, #ff0080, #7928ca)',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default TambahKendaraan;
