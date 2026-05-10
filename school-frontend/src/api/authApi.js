import apiClient from './axios';

export const loginApi = async (credentials) => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
};

export const logoutApi = async () => {
  const { data } = await apiClient.post('/auth/logout');
  return data;
};

export const getCurrentUserApi = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data;
};
