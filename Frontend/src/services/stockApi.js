import axios from 'axios';
import { getAuthToken } from './authStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const stockClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000
});

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getErrorMessage(error, fallback) {
  if (error?.code === 'ERR_NETWORK' || !error?.response) {
    return 'Backend server is unreachable. Start Backend with npm run dev.';
  }

  return error?.response?.data?.message || error?.message || fallback;
}

export async function getStockList(params = {}) {
  try {
    const response = await stockClient.get('/stock', {
      params,
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to fetch stock list'));
  }
}

export async function getStockSummary() {
  try {
    const response = await stockClient.get('/stock/summary', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to fetch stock summary'));
  }
}

export async function getStockById(id) {
  try {
    const response = await stockClient.get(`/stock/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to fetch stock item'));
  }
}

export async function createStock(payload) {
  try {
    const response = await stockClient.post('/stock', payload, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to create stock item'));
  }
}

export async function updateStock(id, payload) {
  try {
    const response = await stockClient.put(`/stock/${id}`, payload, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to update stock item'));
  }
}

export async function deleteStock(id) {
  try {
    const response = await stockClient.delete(`/stock/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to delete stock item'));
  }
}

export async function getPartsList(params = {}) {
  try {
    const query = params && typeof params === 'object' ? params : {};
    const shouldSearch = Boolean(query.q);

    const response = await stockClient.get(shouldSearch ? '/parts/search' : '/parts', {
      params: shouldSearch ? query : undefined,
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to fetch parts list'));
  }
}

export async function getBomsList() {
  try {
    const response = await stockClient.get('/bom', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to fetch BOM list'));
  }
}
