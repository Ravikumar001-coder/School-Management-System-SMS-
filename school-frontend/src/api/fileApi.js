import api from './axios';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
const SERVER_BASE = API_BASE.replace(/\/api\/v1\/?$/, '');

export const fileApi = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  toPublicUrl: (path) => {
    if (!path) return '';
    if (typeof path === 'object') return ''; // Safety check
    if (String(path).startsWith('http://') || String(path).startsWith('https://')) return path;
    return `${SERVER_BASE}${path}`;
  },
};
