import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookAPI } from '../api/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, category]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getAllBooks({
        search: searchQuery,
        kategori: category,
        limit: 20,
      });
      setBooks(response.data.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const rawUser = localStorage.getItem('user');
  let user = null;

  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    user = null;
  }

  const displayName = user?.nama || user?.fullName || user?.email || 'Pengguna';

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>📚 Perpustakaan Digital Kampus</h1>
          <div className="navbar-menu">
            <span>Selamat datang, {displayName}</span>
            {(user?.role === 'admin' || user?.role === 'superadmin') && (
              <>
                <Link to="/admin/tambah-buku" className="btn-secondary">
                  Tambah Buku
                </Link>
                <Link to="/admin/peminjaman" className="btn-secondary">
                  Kelola Peminjaman
                </Link>
                {user?.role === 'superadmin' && (
                  <Link to="/superadmin/kelola-admin" className="btn-superadmin">
                    👑 Kelola Admin
                  </Link>
                )}
              </>
            )}
            {(user?.role !== 'admin' && user?.role !== 'superadmin') && (
              <Link to="/riwayat-peminjaman" className="btn-secondary">
                Riwayat Peminjaman
              </Link>
            )}
            <Link to="/profile" className="btn-secondary">
              Profil
            </Link>
            <button onClick={handleLogout} className="btn-danger">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="search-section">
          <input
            type="text"
            placeholder="Cari buku..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Semua Kategori</option>
            <option value="Fiksi">Fiksi</option>
            <option value="Non-Fiksi">Non-Fiksi</option>
            <option value="Akademik">Akademik</option>
            <option value="Referensi">Referensi</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Memuat buku...</div>
        ) : (
          <div className="books-grid">
            {books.length > 0 ? (
              books.map((book) => (
                <Link
                  key={book.id_buku}
                  to={`/book/${book.id_buku}`}
                  className="book-card"
                >
                  <div className="book-cover">
                    {book.foto_url ? (
                      <img src={book.foto_url} alt={book.judul} />
                    ) : (
                      <div className="book-placeholder">📕</div>
                    )}
                  </div>
                  <h3>{book.judul}</h3>
                  <p className="author">by {book.pengarang}</p>
                  <p className="category">{book.kategori}</p>
                </Link>
              ))
            ) : (
              <div className="no-books">Tidak ada buku ditemukan</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
