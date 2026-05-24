import React, { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register', form);
      toast.success('🎉 Akun berhasil dibuat! Mengarahkan ke login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Gagal mendaftar');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Buat Akun Baru</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Daftar
          </button>
        </form>
        <p style={styles.loginText}>
          Sudah punya akun?{' '}
          <Link to="/login" style={styles.loginLink}>Masuk di sini</Link>
        </p>
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
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#181824',
    borderRadius: 16,
    padding: '30px 25px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 25,
    fontWeight: 700,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  input: {
    padding: 12,
    fontSize: 15,
    borderRadius: 8,
    border: '1px solid #555',
    outline: 'none',
    background: '#1e1e2f',
    color: '#fff',
  },
  button: {
    padding: 12,
    background: 'linear-gradient(to right, #ff0080, #7928ca)',
    color: '#fff',
    fontWeight: 600,
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    cursor: 'pointer',
  },
  loginText: {
    marginTop: 20,
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  loginLink: {
    color: '#ff4dc4',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};

export default RegisterPage;
