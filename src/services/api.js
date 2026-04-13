import axios from 'axios';

// Resolve the backend base URL from environment variables so deployments stay flexible.
const apiBase = process.env.REACT_APP_API_BASE_URL
  || (process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: apiBase,
});

api.interceptors.request.use((config) => {
  // Attach the access token automatically to every authenticated request.
  // This removes the need to manually pass the token from each page.
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
      // Expired or invalid tokens should force the user back to login.
      // Redirecting here centralizes auth failure handling in one place.
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
