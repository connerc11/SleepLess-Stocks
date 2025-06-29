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


export default api;
