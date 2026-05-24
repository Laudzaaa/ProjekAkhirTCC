import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../api/api';
import '../styles/AdminForm.css';

const TambahBuku = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: 'Akademik',
    publishYear: new Date().getFullYear(),
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (file) {
        data.append('file', file);
      }

      await bookAPI.createBook(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambah buku');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Kembali
      </button>

      <h1>Tambah Buku Baru</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Judul Buku *</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Penulis *</label>
          <input
            id="author"
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="isbn">ISBN</label>
          <input
            id="isbn"
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Kategori</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="Akademik">Akademik</option>
            <option value="Fiksi">Fiksi</option>
            <option value="Non-Fiksi">Non-Fiksi</option>
            <option value="Referensi">Referensi</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="publishYear">Tahun Terbit</label>
          <input
            id="publishYear"
            type="number"
            name="publishYear"
            value={formData.publishYear}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Upload File (PDF/EPUB/MOBI)</label>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.epub,.mobi,.txt,.doc,.docx"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Memproses...' : 'Tambah Buku'}
        </button>
      </form>
    </div>
  );
};

export default TambahBuku;
