import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../api/api';
import '../styles/AdminForm.css';

const TambahBuku = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    judul: '',
    pengarang: '',
    isbn: '',
    deskripsi: '',
    kategori: 'Akademik',
    tahun_terbit: new Date().getFullYear(),
    foto_url: '',
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'foto_url') {
      setPhotoPreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await bookAPI.createBook({
        judul: formData.judul,
        pengarang: formData.pengarang,
        isbn: formData.isbn,
        kategori: formData.kategori,
        tahun_terbit: formData.tahun_terbit,
        deskripsi: formData.deskripsi,
        foto_url: formData.foto_url,
      });
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
          <label htmlFor="judul">Judul Buku *</label>
          <input
            id="judul"
            type="text"
            name="judul"
            value={formData.judul}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pengarang">Penulis *</label>
          <input
            id="pengarang"
            type="text"
            name="pengarang"
            value={formData.pengarang}
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
          <label htmlFor="kategori">Kategori</label>
          <select
            id="kategori"
            name="kategori"
            value={formData.kategori}
            onChange={handleInputChange}
          >
            <option value="Akademik">Akademik</option>
            <option value="Fiksi">Fiksi</option>
            <option value="Non-Fiksi">Non-Fiksi</option>
            <option value="Referensi">Referensi</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tahun_terbit">Tahun Terbit</label>
          <input
            id="tahun_terbit"
            type="number"
            name="tahun_terbit"
            value={formData.tahun_terbit}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="deskripsi">Deskripsi</label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleInputChange}
            rows="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="foto_url">Foto Buku (URL)</label>
          <input
            id="foto_url"
            type="url"
            name="foto_url"
            placeholder="https://example.com/cover.jpg"
            value={formData.foto_url}
            onChange={handleInputChange}
          />
          {photoPreview && (
            <div className="photo-preview">
              <p>Preview:</p>
              <img src={photoPreview} alt="Preview Buku" onError={() => setPhotoPreview('')} />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Memproses...' : 'Tambah Buku'}
        </button>
      </form>
    </div>
  );
};

export default TambahBuku;
