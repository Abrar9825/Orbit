const AUTH_TOKEN_KEY = 'orbitAuthToken';
const AUTH_WORKER_KEY = 'orbitWorker';

function normalizeBase64Url(value) {
  if (!value) {
    return '';
  }

  const normalized = String(value).replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  return `${normalized}${'='.repeat(padLength)}`;
}

function parseJwtPayload(token) {
  try {
    const parts = String(token || '').split('.');
    if (parts.length < 2) {
      return null;
    }

    const payload = parts[1];
    const decoded = window.atob(normalizeBase64Url(payload));
    const parsed = JSON.parse(decoded);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function hasUsableAuthToken() {
  const token = getAuthToken();
  if (!token) {
    return false;
  }

  const payload = parseJwtPayload(token);
  if (!payload || payload.exp === undefined || payload.exp === null) {
    return true;
  }

  const exp = Number(payload.exp);
  if (!Number.isFinite(exp)) {
    return true;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  return exp > nowSeconds;
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

export function getStoredWorker() {
  const rawValue = localStorage.getItem(AUTH_WORKER_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

export function setAuthSession({ token, worker }) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  if (worker && typeof worker === 'object') {
    localStorage.setItem(AUTH_WORKER_KEY, JSON.stringify(worker));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_WORKER_KEY);
}
