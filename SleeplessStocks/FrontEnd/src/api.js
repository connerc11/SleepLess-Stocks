// frontend/src/api.js
import axios from 'axios';
import { API_BASE_URL } from './API_CONFIG';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor for better error logging
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Add this function to fetch real stock data from backend
export const fetchStockQuote = (symbol) => api.get(`/api/stock/${symbol}`);

// Edit and delete comment API helpers
export const updateComment = (id, text) => api.put(`/api/comments/${id}`, { text });
export const deleteComment = (id) => api.delete(`/api/comments/${id}`);
// Like/unlike comment
export const likeComment = (id) => api.post(`/api/comments/${id}/like`);





export default api;