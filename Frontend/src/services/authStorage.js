const AUTH_TOKEN_KEY = 'orbitAuthToken';
const AUTH_WORKER_KEY = 'orbitWorker';

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
