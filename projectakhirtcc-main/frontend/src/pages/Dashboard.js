import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import {
  FaBars, FaTimes, FaClipboardList, FaMoneyBill, FaPlus,
  FaHistory, FaCreditCard, FaSignOutAlt, FaChevronLeft, FaChevronRight,
  FaInstagram, FaTiktok, FaYoutube, FaHeadset
} from 'react-icons/fa';

import logo from '../assets/xmotocar.png';
import slider1 from '../assets/slide2.png';
import slider2 from '../assets/slide5.png';
import slider3 from '../assets/slide12.png';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [role, setRole] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const sliderImages = [slider1, slider2, slider3];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Token tidak valid", error);
      }
    }

    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehicles(res.data);
      } catch (err) {
        toast.error('Gagal mengambil data kendaraan');
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('🚪 Berhasil logout!');
    setTimeout(() => navigate('/login'), 1000);
  };

  const filteredVehicles = filter === 'all' ? vehicles : vehicles.filter(v => v.type === filter);

  return (
    <>
      <div style={styles.container}>
        {/* NAVBAR */}
        <div style={styles.navbar}>
          <FaBars size={22} onClick={() => setSidebarOpen(true)} style={{ cursor: 'pointer' }} />
          <img src={logo} alt="XMotoCar" style={styles.logo} />
        </div>

        {/* SIDEBAR */}
        {sidebarOpen && (
          <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <img src={logo} alt="XMotoCar" style={styles.sidebarLogo} />
              <FaTimes size={22} onClick={() => setSidebarOpen(false)} style={{ cursor: 'pointer' }} />
            </div>
            <div style={styles.menuList}>
              <button style={styles.sidebarBtn} onClick={handleLogout}><FaSignOutAlt /> <span>Logout</span></button>
              {role === 'user' && (
                <>
                  <button style={styles.sidebarBtn} onClick={() => navigate('/riwayat')}><FaHistory /><span>Riwayat Sewa</span></button>
                  <button style={styles.sidebarBtn} onClick={() => navigate('/riwayat/pembayaran')}><FaCreditCard /><span>Pembayaran</span></button>
                </>
              )}
              {role === 'admin' && (
                <>
                  <button style={styles.sidebarBtn} onClick={() => navigate('/admin/sewa')}><FaClipboardList /><span>Manajemen Sewa</span></button>
                  <button style={styles.sidebarBtn} onClick={() => navigate('/admin/pembayaran')}><FaMoneyBill /><span>Manajemen Pembayaran</span></button>
                  <button style={styles.sidebarBtn} onClick={() => navigate('/tambah-kendaraan')}><FaPlus /><span>Tambah Kendaraan</span></button>
                </>
              )}
            </div>
          </div>
        )}

        {/* SLIDER */}
        <div style={styles.sliderWrapper}>
          <div style={styles.sliderContainer}>
            <img src={sliderImages[currentSlide]} alt="promo" style={styles.sliderImage} />
            <button onClick={prevSlide} style={{ ...styles.arrow, left: 10 }}><FaChevronLeft /></button>
            <button onClick={nextSlide} style={{ ...styles.arrow, right: 10 }}><FaChevronRight /></button>
          </div>
        </div>

        {/* FILTER */}
        <div style={styles.menu}>
          <button style={filter === 'all' ? styles.activeBtn : styles.btn} onClick={() => setFilter('all')}>Semua</button>
          <button style={filter === 'mobil' ? styles.activeBtn : styles.btn} onClick={() => setFilter('mobil')}>Mobil</button>
          <button style={filter === 'motor' ? styles.activeBtn : styles.btn} onClick={() => setFilter('motor')}>Motor</button>
        </div>

        {/* KENDARAAN */}
        <div style={styles.grid}>
          {filteredVehicles.map(vehicle => (
            <div key={vehicle.id} style={styles.card} onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
              <img src={vehicle.image_url} alt={vehicle.model} style={styles.image} />
              <h3 style={styles.cardTitle}>{vehicle.brand} {vehicle.model}</h3>
              <p style={styles.text}>Rp {parseInt(vehicle.price_per_day).toLocaleString()}/hari</p>
              <p style={{ ...styles.text, color: vehicle.status === 'available' ? 'limegreen' : 'tomato', fontWeight: 'bold' }}>
                {vehicle.status.toUpperCase()}
              </p>
              <p style={styles.rating}>
                ⭐ {vehicle.averageRating ? Number(vehicle.averageRating).toFixed(1) : '0.0'} / 5
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#191927', color: '#fff', padding: '40px 20px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 30 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <img src={logo} alt="XMotoCar" style={{ height: 100, marginBottom: 16 }} />
            <p style={{ lineHeight: 1.6, fontSize: 14 }}>
              XMotoCar adalah platform terpercaya untuk kebutuhan rental mobil dan motor. Nikmati
              kemudahan pemesanan, layanan pelanggan responsif, dan kendaraan terbaik setiap hari.
            </p>
          </div>
          <div style={{ flex: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: 10 }}>PETA SITUS:</h4>
              <p>Login</p>
              <p>Register</p>
              <p>Dashboard</p>
              <p>Riwayat Sewa</p>
              <p>Pembayaran</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: 10 }}>LAYANAN:</h4>
              <p>Sewa Mobil</p>
              <p>Sewa Motor</p>
              <p>Review Kendaraan</p>
              <p>Manajemen</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: 10 }}>IKUTI KAMI</h4>
              <div style={{ display: 'flex', gap: 12 }}>
                <FaInstagram size={22} />
                <FaTiktok size={22} />
                <FaYoutube size={22} />
              </div>
              <h4 style={{ fontWeight: 'bold', marginTop: 20 }}>BANTUAN PELANGGAN</h4>
              <button style={{
                marginTop: 10, background: '#000', border: 'none', color: '#fff',
                padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, fontWeight: 'bold'
              }}>
                <FaHeadset /> Hubungi Kami
              </button>
            </div>
          </div>
        </div>
        <hr style={{ margin: '30px 0', borderColor: '#444' }} />
        <div style={{ textAlign: 'center', fontSize: 13, color: '#bbb' }}>
          <p>© 2025 XMotoCar. Semua Hak Cipta | <span style={{ color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>Tentang Kami</span> | <span style={{ color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>Syarat & Ketentuan</span></p>
        </div>
      </footer>
    </>
  );
};

const styles = {
  container: { minHeight: '100vh', padding: '100px 20px 20px', background: '#0f0f1a', color: '#fff', maxWidth: 1200, margin: '0 auto' },
  navbar: {
    position: 'fixed', top: 0, left: 0, right: 0, height: 60, background: '#0f0f1a',
    display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', zIndex: 999, boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
  },
  logo: { height: 40 },
  sidebar: { position: 'fixed', top: 0, left: 0, width: 260, height: '100%', background: '#1a1a2e', color: '#fff', zIndex: 1000, padding: 20 },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 20 },
  sidebarLogo: { height: 100, objectFit: 'contain' },
  menuList: { display: 'flex', flexDirection: 'column', gap: 10 },
  sidebarBtn: {
    background: '#2e2e48', color: '#fff', display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14
  },
  sliderWrapper: { display: 'flex', justifyContent: 'center', marginBottom: 30 },
  sliderContainer: {
    position: 'relative', width: '100%', maxWidth: 1000, aspectRatio: '20 / 7', borderRadius: 20,
    overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', background: '#000'
  },
  sliderImage: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20,
  },
  arrow: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff',
    border: 'none', padding: 10, borderRadius: '50%', cursor: 'pointer', zIndex: 2
  },
  rating: {
    fontSize: 13, color: '#ffcc00', fontWeight: 'bold', marginTop: 4
  },
  menu: { display: 'flex', justifyContent: 'center', gap: 15, marginBottom: 30, flexWrap: 'wrap' },
  btn: {
    background: '#333', color: '#fff', border: '1px solid #555', padding: '10px 20px', borderRadius: 8, cursor: 'pointer'
  },
  activeBtn: {
    background: 'linear-gradient(to right, #ff0080, #7928ca)', color: '#fff',
    border: '1px solid #7928ca', padding: '10px 20px', borderRadius: 8, cursor: 'pointer'
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20, justifyItems: 'center'
  },
  card: {
    background: '#2d223f', padding: 12, borderRadius: 20, textAlign: 'center',
    width: '100%', maxWidth: 150, cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
  },
  image: { width: '100%', height: 110, objectFit: 'cover', borderRadius: 12, marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  text: { fontSize: 12, marginBottom: 2 },
};

export default Dashboard;
