import axios from 'axios';

const apiBase = process.env.REACT_APP_API_BASE_URL
  || (process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: apiBase,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear token and redirect to login
      localStorage.removeItem('token');
      window.location.hash = '#/login';
    }
    return Promise.reject(error);
  }
);

export default api;
