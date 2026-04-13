import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

function getHeaderValue(headers, key) {
  if (!headers) {
    return '';
  }

  if (typeof headers.get === 'function') {
    return headers.get(key) || '';
  }

  return headers[key] || headers[key.toLowerCase()] || '';
}

function isProxyServerError(error) {
  const status = error?.response?.status;
  const usingRelativeApiBase = typeof API_BASE_URL === 'string' && API_BASE_URL.startsWith('/');

  if (!usingRelativeApiBase || status !== 500) {
    return false;
  }

  const responseData = error?.response?.data;
  const hasStructuredMessage =
    responseData && typeof responseData === 'object' && typeof responseData.message === 'string';

  if (hasStructuredMessage) {
    return false;
  }

  const contentType = String(getHeaderValue(error?.response?.headers, 'content-type')).toLowerCase();

  return contentType.includes('text/plain') || responseData == null || responseData === '';
}

function getErrorMessage(error, fallback) {
  if (error?.code === 'ERR_NETWORK' || !error?.response || isProxyServerError(error)) {
    return 'Backend server is unreachable. Start Backend with npm run dev.';
  }

  return error?.response?.data?.message || error?.message || fallback;
}

export async function login({ userName, password }) {
  try {
    const response = await authClient.post('/auth/login', { userName, password });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to login'));
  }
}

export async function verifyToken(token) {
  try {
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
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to verify session'));
  }
}