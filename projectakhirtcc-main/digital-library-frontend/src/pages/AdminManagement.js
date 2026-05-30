import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/AdminManagement.css';

const AdminManagement = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);

  const rawUser = localStorage.getItem('user');
  const currentUser = rawUser ? JSON.parse(rawUser) : null;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/library/member');
      setMembers(res.data.data || []);
    } catch (err) {
      showNotification('Gagal memuat data member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRoleChange = async (member, newRole) => {
    if (updating) return;
    const confirm = window.confirm(
      `Ubah role "${member.nama}" dari "${member.role || 'member'}" menjadi "${newRole}"?`
    );
    if (!confirm) return;

    setUpdating(member.id_member);
    try {
      await api.put(`/api/library/member/${member.id_member}/role`, { role: newRole });
      setMembers((prev) =>
        prev.map((m) =>
          m.id_member === member.id_member ? { ...m, role: newRole } : m
        )
      );
      showNotification(`✅ Role ${member.nama} berhasil diubah menjadi ${newRole}`);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Gagal mengubah role', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredMembers = members.filter(
    (m) =>
      m.nama?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin': return { label: '👑 Superadmin', cls: 'badge-superadmin' };
      case 'admin':      return { label: '🛡️ Admin',      cls: 'badge-admin' };
      default:           return { label: '👤 Member',     cls: 'badge-member' };
    }
  };

  const stats = {
    total: members.length,
    admin: members.filter((m) => m.role === 'admin').length,
    member: members.filter((m) => !m.role || m.role === 'member').length,
  };

  return (
    <div className="am-page">
      {/* Navbar */}
      <nav className="am-navbar">
        <div className="am-navbar-inner">
          <div className="am-navbar-brand">
            <span className="am-icon">👑</span>
            <span>Panel Superadmin</span>
          </div>
          <div className="am-navbar-actions">
            <Link to="/dashboard" className="am-btn am-btn-ghost">← Dashboard</Link>
            <button onClick={handleLogout} className="am-btn am-btn-danger">Logout</button>
          </div>
        </div>
      </nav>

      <div className="am-container">
        {/* Header */}
        <div className="am-header">
          <div>
            <h1 className="am-title">Manajemen Admin</h1>
            <p className="am-subtitle">Kelola role member — login sebagai: <strong>{currentUser?.email}</strong></p>
          </div>
        </div>

        {/* Stats */}
        <div className="am-stats">
          <div className="am-stat-card am-stat-total">
            <div className="am-stat-num">{stats.total}</div>
            <div className="am-stat-label">Total Member</div>
          </div>
          <div className="am-stat-card am-stat-admin">
            <div className="am-stat-num">{stats.admin}</div>
            <div className="am-stat-label">Admin Aktif</div>
          </div>
          <div className="am-stat-card am-stat-member">
            <div className="am-stat-num">{stats.member}</div>
            <div className="am-stat-label">Member Biasa</div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`am-notification ${notification.type === 'error' ? 'am-notif-error' : 'am-notif-success'}`}>
            {notification.message}
          </div>
        )}

        {/* Search */}
        <div className="am-search-bar">
          <input
            type="text"
            placeholder="🔍 Cari nama atau email member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="am-search-input"
          />
          <button onClick={fetchMembers} className="am-btn am-btn-secondary">Refresh</button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="am-loading">
            <div className="am-spinner" />
            <p>Memuat data member...</p>
          </div>
        ) : (
          <div className="am-table-wrapper">
            <table className="am-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Role Saat Ini</th>
                  <th>Ubah Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="am-empty">Tidak ada member ditemukan</td>
                  </tr>
                ) : (
                  filteredMembers.map((member, idx) => {
                    const badge = getRoleBadge(member.role);
                    const isSelf = member.email === currentUser?.email;
                    const isSuperadmin = member.role === 'superadmin';
                    return (
                      <tr key={member.id_member} className={isSelf ? 'am-row-self' : ''}>
                        <td className="am-td-num">{idx + 1}</td>
                        <td>
                          <div className="am-member-name">
                            {member.nama}
                            {isSelf && <span className="am-you-badge">Anda</span>}
                          </div>
                        </td>
                        <td className="am-td-email">{member.email}</td>
                        <td>
                          <span className={`am-status ${member.status === 'aktif' ? 'am-status-aktif' : 'am-status-nonaktif'}`}>
                            {member.status || 'aktif'}
                          </span>
                        </td>
                        <td>
                          <span className={`am-badge ${badge.cls}`}>{badge.label}</span>
                        </td>
                        <td>
                          {isSuperadmin ? (
                            <span className="am-locked">🔒 Terkunci</span>
                          ) : (
                            <div className="am-role-actions">
                              {member.role !== 'admin' && (
                                <button
                                  className="am-btn am-btn-promote"
                                  disabled={updating === member.id_member}
                                  onClick={() => handleRoleChange(member, 'admin')}
                                >
                                  {updating === member.id_member ? '...' : '⬆ Jadikan Admin'}
                                </button>
                              )}
                              {member.role === 'admin' && (
                                <button
                                  className="am-btn am-btn-demote"
                                  disabled={updating === member.id_member}
                                  onClick={() => handleRoleChange(member, 'member')}
                                >
                                  {updating === member.id_member ? '...' : '⬇ Kembalikan ke Member'}
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
