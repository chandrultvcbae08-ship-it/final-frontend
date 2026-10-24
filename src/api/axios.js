import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token
api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('mediconnect_tokens');
    if (tokens) {
      try {
        const parsed = JSON.parse(tokens);
        if (parsed.access) {
          config.headers.Authorization = `Bearer ${parsed.access}`;
        }
      } catch (e) {
        // Token parse error
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokensStr = localStorage.getItem('mediconnect_tokens');
      if (tokensStr) {
        try {
          const tokens = JSON.parse(tokensStr);
          if (tokens.refresh) {
            const refreshRes = await axios.post(`${API_BASE_URL}/accounts/refresh/`, {
              refresh: tokens.refresh,
            });
            const newAccess = refreshRes.data.access;
            tokens.access = newAccess;
            localStorage.setItem('mediconnect_tokens', JSON.stringify(tokens));
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('mediconnect_tokens');
          localStorage.removeItem('mediconnect_user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
