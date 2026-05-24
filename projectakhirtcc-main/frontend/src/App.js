import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import VehicleDetail from './pages/VehicleDetail';
import TambahKendaraan from './pages/TambahKendaraan';
import EditVehicle from './pages/EditVehicle';
import RentalForm from './pages/RentalForm';
import PrivateRoute from './components/PrivateRoute';
import RiwayatSewa from './pages/RiwayatSewa';
import AdminSewa from './pages/AdminSewa';
import PembayaranForm from './pages/PembayaranForm';
import RiwayatPembayaran from './pages/RiwayatPembayaran';
import AdminPembayaran from './pages/AdminPembayaran';
import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/vehicles/:id" element={<PrivateRoute><VehicleDetail /></PrivateRoute>} />
        <Route path="/tambah-kendaraan" element={<PrivateRoute><TambahKendaraan /></PrivateRoute>} />
        <Route path="/edit/:id" element={<PrivateRoute><EditVehicle /></PrivateRoute>} />
        <Route path="/sewa/:id" element={<PrivateRoute><RentalForm /></PrivateRoute>} />
        <Route path="/pembayaran/:rental_id" element={<PrivateRoute><PembayaranForm /></PrivateRoute>} />
        <Route path="/riwayat" element={<PrivateRoute><RiwayatSewa /></PrivateRoute>} />
        <Route path="/riwayat/pembayaran" element={<PrivateRoute><RiwayatPembayaran /></PrivateRoute>} />
        <Route path="/admin/sewa" element={<PrivateRoute><AdminSewa /></PrivateRoute>} />
        <Route path="/admin/pembayaran" element={<PrivateRoute><AdminPembayaran /></PrivateRoute>} />
        <Route path="/review/:id" element={<PrivateRoute><ReviewPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
