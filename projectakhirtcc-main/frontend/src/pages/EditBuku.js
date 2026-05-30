import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookAPI } from '../api/api';
import '../styles/AdminForm.css';

const EditBuku = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    judul: '',
    pengarang: '',
    penerbit: '',
    isbn: '',
    deskripsi: '',
    kategori: 'Akademik',
    tahun_terbit: new Date().getFullYear(),
    foto_url: '',
    stok: 0,
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [initialStock, setInitialStock] = useState(0);
  const [initialStockAvailable, setInitialStockAvailable] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getBookById(id);
      const book = response.data?.data;
      if (!book) {
        throw new Error('Data buku tidak valid');
      }
      setFormData({
        judul: book.judul || '',
        pengarang: book.pengarang || '',
        penerbit: book.penerbit || '',
        isbn: book.isbn || '',
        deskripsi: book.deskripsi || '',
        kategori: book.kategori || 'Akademik',
        tahun_terbit: book.tahun_terbit || new Date().getFullYear(),
        foto_url: book.foto_url || '',
        stok: Number(book.stok || 0),
      });
      setPhotoPreview(book.foto_url || '');
      setInitialStock(Number(book.stok || 0));
      setInitialStockAvailable(Number(book.stok_tersedia || 0));
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data buku');
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);

    try {
      const newStock = Number(formData.stok || 0);
      const delta = newStock - initialStock;
      const updatedStockAvailable = Math.max(
        0,
        Math.min(newStock, initialStockAvailable + delta)
      );

      await bookAPI.updateBook(id, {
        judul: formData.judul,
        pengarang: formData.pengarang,
        penerbit: formData.penerbit,
        isbn: formData.isbn,
        kategori: formData.kategori,
        tahun_terbit: formData.tahun_terbit,
        deskripsi: formData.deskripsi,
        foto_url: formData.foto_url,
        stok: newStock,
        stok_tersedia: updatedStockAvailable,
      });
      navigate(`/book/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui buku');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Memuat data buku...</div>;

  return (
    <div className="admin-form">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Kembali
      </button>

      <h1>Edit Buku</h1>

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
          <label htmlFor="penerbit">Penerbit</label>
          <input
            id="penerbit"
            type="text"
            name="penerbit"
            value={formData.penerbit}
            onChange={handleInputChange}
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
          <label htmlFor="stok">Stok Total</label>
          <input
            id="stok"
            type="number"
            min="0"
            name="stok"
            value={formData.stok}
            onChange={handleInputChange}
          />
          <small>
            Stok tersedia akan disesuaikan otomatis berdasarkan perubahan stok.
          </small>
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

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
};

export default EditBuku;
