import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const ReviewPage = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const fetchReviews = useCallback(async () => {
    try {
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);
      if (res.data.length > 0) {
        const avg = res.data.reduce((acc, r) => acc + r.rating, 0) / res.data.length;
        setAverageRating(avg.toFixed(1));
      } else {
        setAverageRating(null);
      }
    } catch (err) {
      toast.error('❌ Gagal mengambil review');
    }
  }, [id]);

  const submitReview = async () => {
    if (!rating || rating < 1 || rating > 5 || !comment.trim()) {
        return toast.error('❗ Rating 1-5 dan komentar wajib diisi!');
    }
    try {
        const token = localStorage.getItem('token');
        if (!token) {
        toast.warn('Silakan login terlebih dahulu');
        return;
        }

        await api.post('/reviews', {
        vehicle_id: id,
        rating,
        comment
        }, {
        headers: { Authorization: `Bearer ${token}` }
        });

        toast.success('✅ Review berhasil ditambahkan!');
        setTimeout(() => navigate('/riwayat'), 1000); // ⏱️ Redirect setelah toast
    } catch {
        toast.error('❌ Gagal mengirim review');
    }
    };


  useEffect(() => {
    fetchReviews();
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, [fetchReviews]);

  return (
    <div style={styles.container}>
      {/* ✅ NAVBAR */}
      <div style={styles.navbar}>
        <FaArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <span style={styles.navTitle}>Review Kendaraan</span>
      </div>

      <div style={styles.inner}>
        {averageRating && (
          <div style={styles.averageBox}>
            <span style={styles.averageLabel}>Rata-rata Rating:</span>
            <span style={styles.averageValue}>{averageRating} / 5</span>
          </div>
        )}

        {isLoggedIn && (
          <div style={styles.form}>
            <input
              type="number"
              min="1"
              max="5"
              placeholder="Rating (1-5)"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              style={styles.input}
            />
            <textarea
              placeholder="Tulis komentar..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={styles.textarea}
            ></textarea>
            <button style={styles.button} onClick={submitReview}>Kirim Review</button>
          </div>
        )}

        <div style={styles.reviewList}>
          {reviews.map((r) => (
            <div key={r.id} style={styles.reviewCard}>
              <h4 style={styles.reviewer}>{r.user?.name}</h4>
              <p style={styles.rating}>⭐ {r.rating} / 5</p>
              <p style={styles.comment}>{r.comment}</p>
              <p style={styles.date}>{new Date(r.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f0f1a',
    color: '#fff',
    paddingTop: 80
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
  inner: {
    padding: '20px 20px 40px',
    maxWidth: 800,
    margin: '0 auto'
  },
  averageBox: {
    background: '#222',
    padding: 12,
    borderRadius: 12,
    textAlign: 'center',
    marginBottom: 30
  },
  averageLabel: {
    fontSize: 16,
    marginRight: 8
  },
  averageValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gold'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 30
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #555',
    background: '#2a2a3a',
    color: '#fff'
  },
  textarea: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #555',
    background: '#2a2a3a',
    color: '#fff',
    minHeight: 80
  },
  button: {
    padding: '10px 20px',
    borderRadius: 8,
    background: 'linear-gradient(to right, #ff0080, #7928ca)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  reviewCard: {
    background: '#1e1e2f',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
  },
  reviewer: {
    marginBottom: 4,
    fontWeight: 'bold'
  },
  rating: {
    marginBottom: 4,
    color: 'gold'
  },
  comment: {
    marginBottom: 6
  },
  date: {
    fontSize: 12,
    color: '#aaa'
  }
};

export default ReviewPage;
