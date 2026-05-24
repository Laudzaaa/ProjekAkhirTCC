import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { FaArrowLeft } from 'react-icons/fa';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    brand: '',
    model: '',
    plate_number: '',
    price_per_day: '',
    status: 'available',
    image_url: '',
    type: 'mobil'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm(res.data);
      } catch {
        toast.error('❌ Gagal memuat data kendaraan');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brand || !form.model || !form.plate_number || !form.price_per_day || !form.image_url) {
      return toast.error('❌ Semua field wajib diisi!');
    }

    if (parseInt(form.price_per_day) <= 0) {
      return toast.error('❌ Harga sewa harus lebih dari 0');
    }

    try {
      const token = localStorage.getItem('token');
      await api.put(`/vehicles/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Kendaraan berhasil diupdate!');
      navigate('/dashboard');
    } catch {
      toast.error('❌ Gagal update kendaraan');
    }
  };

  if (loading) return <p style={styles.loading}>Memuat data kendaraan...</p>;

  return (
    <div style={styles.container}>
      {/* Sticky Navbar */}
      <div style={styles.navbar}>
        <FaArrowLeft size={20} onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        <span style={styles.navTitle}>Edit Kendaraan</span>
      </div>

      {/* Form Card */}
      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
            <option value="mobil">Mobil</option>
            <option value="motor">Motor</option>
          </select>
          <input type="text" name="brand" value={form.brand} onChange={handleChange} placeholder="Merk" style={styles.input} required />
          <input type="text" name="model" value={form.model} onChange={handleChange} placeholder="Model" style={styles.input} required />
          <input type="text" name="plate_number" value={form.plate_number} onChange={handleChange} placeholder="Plat Nomor" style={styles.input} required />
          <input type="number" name="price_per_day" value={form.price_per_day} onChange={handleChange} placeholder="Harga per Hari" style={styles.input} required />
          <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
            <option value="available">Tersedia</option>
            <option value="rented">Disewa</option>
          </select>
          <input type="text" name="image_url" value={form.image_url} onChange={handleChange} placeholder="URL Gambar" style={styles.input} required />
          <button type="submit" style={styles.button}>Simpan Perubahan</button>
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
    flexDirection: 'column',
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
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14
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
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 100
  }
};

export default EditVehicle;
