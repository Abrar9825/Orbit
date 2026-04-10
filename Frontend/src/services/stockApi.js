import axios from 'axios';
import { getAuthToken } from './authStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const stockClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000
});

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getErrorMessage(error, fallback) {
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

export async function getPartsList() {
  try {
    const response = await stockClient.get('/parts', {
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
