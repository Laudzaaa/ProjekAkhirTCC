import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AdminPembayaran = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/payments/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch {
      toast.error('❌ Gagal mengambil data pembayaran');
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    const result = await Swal.fire({
      title: 'Ubah status pembayaran?',
      text: `Status akan diubah menjadi "${status}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, ubah',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      await api.put(`/payments/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Status pembayaran diperbarui');
      fetchPayments();
    } catch {
      toast.error('❌ Gagal memperbarui status');
    }
  };

  const generateInvoice = async (payment) => {
    const original = document.getElementById(`invoice-${payment.id}`);
    if (!original) return;

    const clone = original.cloneNode(true);
    clone.style.background = '#ffffff';
    clone.style.color = '#000000';
    clone.style.padding = '20px';
    clone.style.fontSize = '12px';
    clone.style.fontFamily = 'Arial, sans-serif';
    clone.style.width = '500px';

    const hiddenDiv = document.createElement('div');
    hiddenDiv.style.position = 'fixed';
    hiddenDiv.style.top = '-10000px';
    hiddenDiv.style.left = '-10000px';
    hiddenDiv.appendChild(clone);
    document.body.appendChild(hiddenDiv);

    const canvas = await html2canvas(clone, {
      scale: 2,
      backgroundColor: '#ffffff'
    });

    document.body.removeChild(hiddenDiv);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`Invoice-${payment.rental?.vehicle?.model || 'kendaraan'}.pdf`);
  };

  const filteredPayments = payments.filter(p =>
    p.rental?.user?.name?.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || p.status === statusFilter)
  );

  return (
    <div style={styles.container}>
      {/* Sticky Navbar */}
      <div style={styles.navbar}>
        <FaArrowLeft size={20} onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        <span style={styles.navTitle}>Manajemen Pembayaran</span>
      </div>

      {/* Search + Filter */}
      <div style={styles.header}>
        <input
          type="text"
          placeholder="🔍 Cari nama user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      <div style={styles.filterMenu}>
        {['all', 'paid', 'pending', 'failed'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={statusFilter === status ? styles.activeBtn : styles.btn}
          >
            {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Payment Cards */}
      {filteredPayments.length === 0 ? (
        <p style={styles.text}>Belum ada pembayaran</p>
      ) : (
        <div style={styles.grid}>
          {filteredPayments.map((p) => (
            <div key={p.id} style={styles.card}>
              <div id={`invoice-${p.id}`} style={styles.invoiceBox}>
                <h3 style={styles.cardTitle}>{p.rental?.vehicle?.brand} {p.rental?.vehicle?.model}</h3>
                <p><strong>Nama User:</strong> {p.rental?.user?.name}</p>
                <p><strong>Metode:</strong> {p.payment_method}</p>
                <p><strong>Jumlah:</strong> Rp{parseInt(p.amount).toLocaleString()}</p>
                <p><strong>Status:</strong> {p.status.toUpperCase()}</p>
              </div>
              <div style={styles.btnGroup}>
                <button onClick={() => handleStatusUpdate(p.id, 'paid')} style={styles.greenBtn}>✔ Paid</button>
                <button onClick={() => handleStatusUpdate(p.id, 'failed')} style={styles.redBtn}>✖ Failed</button>
                <button onClick={() => generateInvoice(p)} style={styles.invoiceBtn}>🧾 Cetak</button>
              </div>
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
    color: '#fff',
    padding: '100px 20px 30px'
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
  header: {
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  search: {
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #555',
    background: '#2e2e3a',
    color: '#fff',
    minWidth: 250
  },
  filterMenu: {
    display: 'flex',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 30,
    flexWrap: 'wrap'
  },
  btn: {
    background: '#333',
    color: '#fff',
    border: '1px solid #555',
    padding: '10px 20px',
    borderRadius: 10,
    cursor: 'pointer'
  },
  activeBtn: {
    background: 'linear-gradient(to right, #ff0080, #7928ca)',
    color: '#fff',
    border: '1px solid #7928ca',
    padding: '10px 20px',
    borderRadius: 10,
    cursor: 'pointer'
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.8,
    marginTop: 50
  },
  grid: {
    display: 'grid',
    gap: 20,
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
  },
  card: {
    background: '#1e1e2f',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  invoiceBox: {
    paddingBottom: 10
  },
  btnGroup: {
    marginTop: 10,
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap'
  },
  greenBtn: {
    background: 'limegreen',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  redBtn: {
    background: '#d33',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  invoiceBtn: {
    background: '#007bff',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default AdminPembayaran;
