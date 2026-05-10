import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
const SERVER_BASE = API_BASE.replace(/\/api\/v1\/?$/, '');

export const fileApi = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE}/files/upload`, formData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return response.data;
  },

  toPublicUrl: (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${SERVER_BASE}${path}`;
  },
};
