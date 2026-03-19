// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/', // MUST be '/' to trigger the Vite proxy in dev and Redirects in prod
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // Logic to skip token for login
  const isLoginRequest = config.url.includes('/login');

  if (token && !isLoginRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;