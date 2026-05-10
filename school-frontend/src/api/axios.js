// src/api/axios.js
import axios from 'axios';

/**
 * Enterprise API Client
 * - Automatic JWT injection
 * - Auto-refresh: on 401, tries POST /auth/refresh (HttpOnly cookie) silently
 * - Queues concurrent requests during refresh to avoid double-refresh
 * - Falls back to logout if refresh fails
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  // Required for HttpOnly refresh-token cookie
  timeout: 15000,
});

// ── Refresh state ────────────────────────────────────────────────────────────
let isRefreshing       = false;
let failedQueue        = [];  // Requests waiting for token refresh

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) { prom.reject(error); }
    else       { prom.resolve(token); }
  });
  failedQueue = [];
};

// ── Request interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (process.env.NODE_ENV === 'development') {
      config.metadata = { startTime: Date.now() };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development' && response.config.metadata) {
      const ms = Date.now() - response.config.metadata.startTime;
      console.log(`[API] ${response.config.method.toUpperCase()} ${response.config.url} - ${ms}ms`);
    }
    return response;
  },
  async (error) => {
    const { response, config } = error;
    const status = response?.status;

    // ── 401: try to silently refresh token ──────────────────────────────────
    if (status === 401 && !config._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          config.headers.Authorization = `Bearer ${token}`;
          return api(config);
        }).catch(err => Promise.reject(err));
      }

      config._retry   = true;
      isRefreshing    = true;

      try {
        // POST /auth/refresh — sends HttpOnly cookie automatically (withCredentials: true)
        const refreshRes = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes.data?.token;
        if (newToken) {
          localStorage.setItem('token', newToken);
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          config.headers.Authorization = `Bearer ${newToken}`;

          // Update stored user with fresh data if available
          if (refreshRes.data?.username) {
            const stored = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...stored, ...refreshRes.data }));
          }

          processQueue(null, newToken);
          return api(config);  // Retry the original request
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed — force logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        api._toast?.warning?.('Session expired. Please log in again.');
        setTimeout(() => { window.location.href = '/login'; }, 1500);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ── Other errors ─────────────────────────────────────────────────────────
    if (api._toast) {
      if (!status) {
        api._toast.error?.('Network Error: Please check your connection.');
      } else if (status === 403) {
        api._toast.error?.('Access Denied: Insufficient permissions.');
      } else if (status === 429) {
        api._toast.warning?.('Too many requests. Please slow down.');
      } else if (status >= 500) {
        api._toast.error?.('Server Error. Please try again later.');
      } else if (status === 400 && response.data?.message) {
        api._toast.warning?.(response.data.message);
      }
    }

    return Promise.reject(error);
  }
);

export const setAxiosToast = (toastInstance) => {
  api._toast = toastInstance;
};

export default api;