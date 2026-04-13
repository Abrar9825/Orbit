import axios from 'axios';
import { getAuthToken } from './authStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const configurationClient = axios.create({
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

async function request(config, fallbackMessage) {
  try {
    const response = await configurationClient.request({
      ...config,
      headers: {
        ...(config.headers || {}),
        ...getAuthHeaders()
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage));
  }
}

export function getMachines(params = {}) {
  return request(
    {
      method: 'get',
      url: '/machine',
      params
    },
    'Unable to fetch machines'
  );
}

export function getMachineById(id) {
  return request(
    {
      method: 'get',
      url: `/machine/${id}`
    },
    'Unable to fetch machine'
  );
}

export function createMachine(payload) {
  return request(
    {
      method: 'post',
      url: '/machine',
      data: payload
    },
    'Unable to create machine'
  );
}

export function updateMachine(id, payload) {
  return request(
    {
      method: 'put',
      url: `/machine/${id}`,
      data: payload
    },
    'Unable to update machine'
  );
}

export function deleteMachine(id) {
  return request(
    {
      method: 'delete',
      url: `/machine/${id}`
    },
    'Unable to delete machine'
  );
}

export function getParts() {
  return request(
    {
      method: 'get',
      url: '/parts'
    },
    'Unable to fetch parts'
  );
}

export function getPartById(id) {
  return request(
    {
      method: 'get',
      url: `/parts/${id}`
    },
    'Unable to fetch part'
  );
}

export function createPart(payload) {
  return request(
    {
      method: 'post',
      url: '/parts',
      data: payload
    },
    'Unable to create part'
  );
}

export function updatePart(id, payload) {
  return request(
    {
      method: 'put',
      url: `/parts/${id}`,
      data: payload
    },
    'Unable to update part'
  );
}

export function deletePart(id) {
  return request(
    {
      method: 'delete',
      url: `/parts/${id}`
    },
    'Unable to delete part'
  );
}

export function getBoms() {
  return request(
    {
      method: 'get',
      url: '/bom'
    },
    'Unable to fetch BOM templates'
  );
}

export function getBomById(id) {
  return request(
    {
      method: 'get',
      url: `/bom/${id}`
    },
    'Unable to fetch BOM template'
  );
}

export function createBom(payload) {
  return request(
    {
      method: 'post',
      url: '/bom',
      data: payload
    },
    'Unable to create BOM template'
  );
}

export function updateBom(id, payload) {
  return request(
    {
      method: 'put',
      url: `/bom/${id}`,
      data: payload
    },
    'Unable to update BOM template'
  );
}

export function deleteBom(id) {
  return request(
    {
      method: 'delete',
      url: `/bom/${id}`
    },
    'Unable to delete BOM template'
  );
}

export function getUsers() {
  return request(
    {
      method: 'get',
      url: '/users'
    },
    'Unable to fetch users'
  );
}

export function getUserById(id) {
  return request(
    {
      method: 'get',
      url: `/users/${id}`
    },
    'Unable to fetch user'
  );
}

export function createUser(payload) {
  return request(
    {
      method: 'post',
      url: '/users',
      data: payload
    },
    'Unable to create user'
  );
}

export function updateUser(id, payload) {
  return request(
    {
      method: 'put',
      url: `/users/${id}`,
      data: payload
    },
    'Unable to update user'
  );
}

export function deleteUser(id) {
  return request(
    {
      method: 'delete',
      url: `/users/${id}`
    },
    'Unable to delete user'
  );
}

export function getMasterConfig() {
  return request(
    {
      method: 'get',
      url: '/config-master'
    },
    'Unable to fetch master data'
  );
}

export function updateMasterConfig(payload) {
  return request(
    {
      method: 'put',
      url: '/config-master',
      data: payload
    },
    'Unable to update master data'
  );
}

export function addMasterConfigValue(payload) {
  return request(
    {
      method: 'post',
      url: '/config-master/options',
      data: payload
    },
    'Unable to add master data value'
  );
}

export function removeMasterConfigValue(payload) {
  return request(
    {
      method: 'delete',
      url: '/config-master/options',
      data: payload
    },
    'Unable to remove master data value'
  );
}
