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
        searchQuery,
        category,
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

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>📚 Perpustakaan Digital Kampus</h1>
          <div className="navbar-menu">
            <span>Selamat datang, {user.fullName}</span>
            {user.role === 'admin' && (
              <Link to="/admin/tambah-buku" className="btn-secondary">
                Tambah Buku
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
                  key={book.id}
                  to={`/book/${book.id}`}
                  className="book-card"
                >
                  <div className="book-cover">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} />
                    ) : (
                      <div className="book-placeholder">📕</div>
                    )}
                  </div>
                  <h3>{book.title}</h3>
                  <p className="author">by {book.author}</p>
                  <p className="category">{book.category}</p>
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
