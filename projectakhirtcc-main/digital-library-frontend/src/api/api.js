import api from './axios';

// Member API (Library System)
export const userAPI = {
  register: (data) => api.post('/library/member/register', data),
  login: (data) => api.post('/library/member/login', data),
  getProfile: () => api.get('/library/member/profile'),
  updateProfile: (data) => api.put('/library/member/profile', data),
  getAllUsers: () => api.get('/library/member'),
};

// Book API (Library System)
export const bookAPI = {
  getAllBooks: (params) => api.get('/library/buku', { params }),
  getBookById: (id) => api.get(`/library/buku/${id}`),
  createBook: (data) => api.post('/library/buku', data),
  updateBook: (id, data) => api.put(`/library/buku/${id}`, data),
  deleteBook: (id) => api.delete(`/library/buku/${id}`),
};

// Borrowing API (Library System)
export const borrowingAPI = {
  createBorrowing: (data) => api.post('/library/peminjaman', data),
  getMyBorrowings: () => api.get('/library/peminjaman/my'),
  getBorrowingList: () => api.get('/library/peminjaman'),
  getBorrowingById: (id) => api.get(`/library/peminjaman/${id}`),
};

// Return API (Library System)
export const returnAPI = {
  createReturn: (data) => api.post('/library/pengembalian', data),
  getReturnHistory: () => api.get('/library/pengembalian'),
};
