import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { verifyToken } from '../../services/authApi';
import { clearAuthSession, getAuthToken } from '../../services/authStorage';

function AuthGateLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-sm font-medium text-slate-600">Checking session...</div>
    </div>
  );
}

function useAuthStatus() {
  const [status, setStatus] = useState(() => (getAuthToken() ? 'checking' : 'guest'));

  useEffect(() => {
    let isActive = true;
    const token = getAuthToken();

    if (!token) {
      setStatus('guest');
      return () => {
        isActive = false;
      };
    }

    const validateSession = async () => {
      try {
        const result = await verifyToken(token);
        if (!isActive) {
          return;
        }

        if (result?.status === 'success') {
          setStatus('authenticated');
          return;
        }

        throw new Error('Invalid session');
      } catch {
        clearAuthSession();
        if (isActive) {
          setStatus('guest');
        }
      }
    };

    validateSession();

    return () => {
      isActive = false;
    };
  }, []);

  return status;
}

export function ProtectedRoute() {
  const location = useLocation();
  const status = useAuthStatus();

  if (status === 'checking') {
    return <AuthGateLoader />;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const status = useAuthStatus();

  if (status === 'checking') {
    return <AuthGateLoader />;
  }

  if (status === 'authenticated') {
    return <Navigate to="/cards" replace />;
  }

  return <Outlet />;
}
