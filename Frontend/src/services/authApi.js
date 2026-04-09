import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

export async function login({ userName, password }) {
  const response = await authClient.post('/auth/login', { userName, password });
  return response.data;
}

export async function verifyToken(token) {
  const response = await authClient.post(
    '/auth/verify-token',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
}