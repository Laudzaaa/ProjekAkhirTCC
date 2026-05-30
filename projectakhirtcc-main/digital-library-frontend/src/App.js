import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import BookDetail from './pages/BookDetail';
import Profile from './pages/Profile';
import TambahBuku from './pages/TambahBuku';
import EditBuku from './pages/EditBuku';
import RiwayatPeminjaman from './pages/RiwayatPeminjaman';
import AdminPeminjaman from './pages/AdminPeminjaman';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/book/:id"
          element={
            <PrivateRoute>
              <BookDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/tambah-buku"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <TambahBuku />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/edit-buku/:id"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <EditBuku />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/peminjaman"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminPeminjaman />
            </PrivateRoute>
          }
        />

        <Route
          path="/riwayat-peminjaman"
          element={
            <PrivateRoute>
              <RiwayatPeminjaman />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
