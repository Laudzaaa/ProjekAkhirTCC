import api from './axios';

// Member API (Library System)
export const userAPI = {
  register: (data) => api.post('/api/library/member/register', data),
  login: (data) => api.post('/api/library/member/login', data),
  getProfile: () => api.get('/api/library/member/profile'),
  updateProfile: (data) => api.put('/api/library/member/profile', data),
  getAllUsers: () => api.get('/api/library/member'),
};

// Book API (Library System)
export const bookAPI = {
  getAllBooks: (params) => api.get('/api/library/buku', { params }),
  getBookById: (id) => api.get(`/api/library/buku/${id}`),
  createBook: (data) => api.post('/api/library/buku', data),
  updateBook: (id, data) => api.put(`/api/library/buku/${id}`, data),
  deleteBook: (id) => api.delete(`/api/library/buku/${id}`),
};

// Borrowing API (Library System)
export const borrowingAPI = {
  createBorrowing: (data) => api.post('/api/library/peminjaman', data),
  getMyBorrowings: () => api.get('/api/library/peminjaman/my'),
  getBorrowingList: (params) => api.get('/api/library/peminjaman', { params }),
  getBorrowingById: (id) => api.get(`/api/library/peminjaman/${id}`),
  approveBorrowing: (id) => api.put(`/api/library/peminjaman/${id}/approve`),
  rejectBorrowing: (id) => api.delete(`/api/library/peminjaman/${id}/reject`),
};

// Return API (Library System)
export const returnAPI = {
  createReturn: (data) => api.post('/api/library/pengembalian', data),
  getReturnHistory: () => api.get('/api/library/pengembalian'),
};
