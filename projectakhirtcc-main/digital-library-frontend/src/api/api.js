import api from './axios';

// User API
export const userAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
  deleteUser: (uid) => api.delete(`/users/${uid}`),
};

// Book API
export const bookAPI = {
  getAllBooks: (params) => api.get('/books', { params }),
  getBookById: (id) => api.get(`/books/${id}`),
  createBook: (data) => api.post('/books', data),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`),
  downloadBook: (id) => api.post(`/books/${id}/download`),
};

// Favorite API
export const favoriteAPI = {
  addFavorite: (bookId) => api.post('/favorites', { bookId }),
  removeFavorite: (bookId) => api.delete(`/favorites/${bookId}`),
  getUserFavorites: () => api.get('/favorites'),
  isFavorite: (bookId) => api.get(`/favorites/check/${bookId}`),
};

// Review API
export const reviewAPI = {
  getReviewsByBook: (bookId, params) => api.get(`/reviews/${bookId}`, { params }),
  createReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};
