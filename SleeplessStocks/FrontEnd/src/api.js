// frontend/src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add this function to fetch real stock data from backend
export const fetchStockQuote = (symbol) => api.get(`/api/stock/${symbol}`);

// Edit and delete comment API helpers
export const updateComment = (id, text) => api.put(`/api/comments/${id}`, { text });
export const deleteComment = (id) => api.delete(`/api/comments/${id}`);
// Like/unlike comment
export const likeComment = (id) => api.post(`/api/comments/${id}/like`);


export default api;
