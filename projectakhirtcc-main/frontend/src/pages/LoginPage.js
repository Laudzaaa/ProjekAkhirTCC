import React, { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('📦 Axios baseURL:', api.defaults.baseURL);

      const res = await api.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('🔥 Login berhasil! Mengarahkan ke dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('❌ Error saat login:', err?.response?.config?.url);
      toast.error(err.response?.data?.message || '❌ Gagal login');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Masuk ke Sistem</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Masuk
          </button>
        </form>
        <p style={styles.registerText}>
          Belum punya akun?{' '}
          <Link to="/register" style={styles.registerLink}>Daftar di sini</Link>
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
    maxWidth: 400,
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
  registerText: {
    marginTop: 20,
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  registerLink: {
    color: '#ff4dc4',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};

export default LoginPage;
