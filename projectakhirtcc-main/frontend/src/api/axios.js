import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-projectakhir-122089089856.us-central1.run.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Tambahkan token otomatis ke header jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
