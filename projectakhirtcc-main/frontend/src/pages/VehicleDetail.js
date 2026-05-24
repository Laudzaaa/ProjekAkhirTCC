import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaArrowLeft } from 'react-icons/fa';
import SwalBase from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Swal = withReactContent(SwalBase);

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [role, setRole] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setRole(payload.role);
        }
        const res = await api.get(`/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicle(res.data);

        const reviewRes = await api.get(`/reviews/${id}`);
        setReviews(reviewRes.data);
      } catch {
        Swal.fire('Error', 'Gagal mengambil detail kendaraan', 'error');
        navigate('/dashboard');
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: <p>Yakin ingin menghapus kendaraan ini?</p>,
      html: 'Data kendaraan akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7928ca',
      cancelButtonColor: '#333',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      background: '#1e1e2f',
      color: '#fff',
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await Swal.fire({
          title: <p>Berhasil!</p>,
          text: 'Kendaraan berhasil dihapus.',
          icon: 'success',
          confirmButtonColor: '#7928ca',
          background: '#1e1e2f',
          color: '#fff',
        });
        navigate('/dashboard');
      } catch {
        await Swal.fire({
          title: <p>Gagal!</p>,
          text: 'Gagal menghapus kendaraan.',
          icon: 'error',
          confirmButtonColor: '#ff0080',
          background: '#1e1e2f',
          color: '#fff',
        });
      }
    }
  };

  const handleEdit = () => navigate(`/edit/${id}`);
  const handleSewa = () => navigate(`/sewa/${id}`);

  if (!vehicle) return <p style={styles.loading}>Memuat detail kendaraan...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <FaArrowLeft size={20} onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        <span style={styles.navTitle}>Detail Kendaraan</span>
      </div>

      <div style={styles.card}>
        <img src={vehicle.image_url} alt={vehicle.model} style={styles.image} />
        <h2 style={styles.vehicleTitle}>{vehicle.brand} {vehicle.model}</h2>
        <p style={styles.text}><strong>Plat Nomor:</strong> {vehicle.plate_number}</p>
        <p style={styles.text}><strong>Jenis:</strong> {vehicle.type}</p>
        <p style={styles.text}><strong>Harga Sewa:</strong> Rp{parseInt(vehicle.price_per_day).toLocaleString()}/hari</p>
        <p style={styles.text}>
          <strong>Status:</strong>
          <span style={{ color: vehicle.status === 'available' ? 'limegreen' : 'tomato', fontWeight: 'bold', marginLeft: 8 }}>
            {vehicle.status.toUpperCase()}
          </span>
        </p>

        {role === 'admin' && (
          <div style={styles.actionRow}>
            <button style={styles.editBtn} onClick={handleEdit}>Edit</button>
            <button style={styles.deleteBtn} onClick={handleDelete}>Hapus</button>
          </div>
        )}

        {role === 'user' && vehicle.status === 'available' && (
          <button style={styles.sewaBtn} onClick={handleSewa}>Sewa Sekarang</button>
        )}

        {role === 'user' && vehicle.status === 'rented' && (
          <p style={styles.unavailableText}>🚫 Kendaraan sedang disewa</p>
        )}
      </div>

      {reviews.length > 0 && (
        <div style={{ maxWidth: 600, margin: '40px auto 0' }}>
          <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Review Pengguna</h3>
          {reviews.map((r) => (
            <div key={r.id} style={{
              background: '#2c2c3e',
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
              textAlign: 'left'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: 4 }}>{r.user?.name || 'Anonim'}</p>
              <p style={{ color: 'gold', marginBottom: 6 }}>⭐ {r.rating} / 5</p>
              <p style={{ marginBottom: 6 }}>{r.comment}</p>
              <p style={{ fontSize: 12, color: '#aaa' }}>{new Date(r.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f0f1a',
    padding: '100px 20px 30px',
    color: '#fff',
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
    maxWidth: 600,
    margin: '0 auto',
    background: '#1e1e2f',
    padding: 30,
    borderRadius: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    textAlign: 'center'
  },
  image: {
    width: '100%',
    maxHeight: 250,
    objectFit: 'cover',
    borderRadius: 12,
    marginBottom: 20,
  },
  vehicleTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 15,
    marginBottom: 8,
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    flexWrap: 'wrap'
  },
  editBtn: {
    background: '#f0c040',
    border: 'none',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  deleteBtn: {
    background: '#d33030',
    border: 'none',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  sewaBtn: {
    marginTop: 20,
    background: 'limegreen',
    color: '#fff',
    padding: '12px 20px',
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  unavailableText: {
    color: 'tomato',
    fontWeight: 'bold',
    marginTop: 20
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 100
  }
};

export default VehicleDetail;
