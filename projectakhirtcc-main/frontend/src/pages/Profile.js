import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../api/api';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    nama: '',
    email: '',
    nomor_identitas: '',
    nomor_hp: '',
    alamat: '',
    status: '',
    role: '',
  });
  const [formData, setFormData] = useState({
    nama: '',
    nomor_hp: '',
    alamat: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const readStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
      return {};
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      const data = response.data?.data || response.data || {};

      const nextProfile = {
        nama: data.nama || '',
        email: data.email || '',
        nomor_identitas: data.nomor_identitas || '',
        nomor_hp: data.nomor_hp || '',
        alamat: data.alamat || '',
        status: data.status || '',
        role: data.role || readStoredUser().role || '',
      };

      setProfile(nextProfile);
      setFormData({
        nama: nextProfile.nama,
        nomor_hp: nextProfile.nomor_hp,
        alamat: nextProfile.alamat,
      });
    } catch (err) {
      const fallbackUser = readStoredUser();
      const fallbackProfile = {
        nama: fallbackUser.nama || fallbackUser.fullName || '',
        email: fallbackUser.email || '',
        nomor_identitas: fallbackUser.nomor_identitas || '',
        nomor_hp: fallbackUser.nomor_hp || '',
        alamat: fallbackUser.alamat || '',
        status: fallbackUser.status || '',
        role: fallbackUser.role || '',
      };

      setProfile(fallbackProfile);
      setFormData({
        nama: fallbackProfile.nama,
        nomor_hp: fallbackProfile.nomor_hp,
        alamat: fallbackProfile.alamat,
      });
      setError(err.response?.data?.message || 'Profil belum bisa dimuat dari server, menampilkan data lokal.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await userAPI.updateProfile(formData);
      const updated = response.data?.data || {};

      setProfile((current) => ({
        ...current,
        nama: updated.nama ?? formData.nama,
        nomor_hp: updated.nomor_hp ?? formData.nomor_hp,
        alamat: updated.alamat ?? formData.alamat,
      }));

      const storedUser = readStoredUser();
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...storedUser,
          nama: formData.nama,
          fullName: formData.nama,
          nomor_hp: formData.nomor_hp,
          alamat: formData.alamat,
        })
      );

      setMessage('Profil berhasil diperbarui.');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile.nama || 'Pengguna';

  if (loading) {
    return <div className="profile-page loading-state">Memuat profil...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <div className="profile-hero">
          <div>
            <p className="eyebrow">Akun saya</p>
            <h1>{displayName}</h1>
            <p className="hero-copy">Lihat dan perbarui informasi dasar akun kamu di sini.</p>
          </div>
          <Link to="/dashboard" className="back-link">Kembali ke dashboard</Link>
        </div>

        {error && <div className="notice notice-error">{error}</div>}
        {message && <div className="notice notice-success">{message}</div>}

        <div className="profile-grid">
          <section className="profile-card identity-card">
            <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
            <h2>{displayName}</h2>
            <p>{profile.email || 'Email belum tersedia'}</p>

            <div className="meta-list">
              <div>
                <span>Role</span>
                <strong>{profile.role || '-'}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{profile.status || '-'}</strong>
              </div>
              <div>
                <span>No. Identitas</span>
                <strong>{profile.nomor_identitas || '-'}</strong>
              </div>
            </div>
          </section>

          <section className="profile-card form-card">
            <h2>Edit Profil</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nama Lengkap
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                />
              </label>

              <label>
                Nomor HP
                <input
                  type="text"
                  name="nomor_hp"
                  value={formData.nomor_hp}
                  onChange={handleChange}
                  placeholder="Masukkan nomor HP"
                />
              </label>

              <label>
                Alamat
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Masukkan alamat"
                />
              </label>

              <div className="actions">
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button type="button" className="secondary-btn" onClick={() => navigate('/dashboard')}>
                  Batal
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;