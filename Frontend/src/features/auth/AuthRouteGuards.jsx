import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { verifyToken } from '../../services/authApi';
import { clearAuthSession, getAuthToken, hasUsableAuthToken } from '../../services/authStorage';

function AuthGateLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-sm font-medium text-slate-600">Checking session...</div>
    </div>
  );
}

function useAuthStatus() {
  const [status, setStatus] = useState(() => (hasUsableAuthToken() ? 'authenticated' : 'guest'));
  const [isChecking, setIsChecking] = useState(() => Boolean(getAuthToken()));

  useEffect(() => {
    let isActive = true;
    const token = getAuthToken();

    if (!token) {
      setStatus('guest');
      setIsChecking(false);
      return () => {
        isActive = false;
      };
    }

    if (!hasUsableAuthToken()) {
      clearAuthSession();
      setStatus('guest');
      setIsChecking(false);
      return () => {
        isActive = false;
      };
    }

    setIsChecking(true);

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
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    };

    validateSession();

    return () => {
      isActive = false;
    };
  }, []);

  return { status, isChecking };
}

export function ProtectedRoute() {
  const location = useLocation();
  const { status, isChecking } = useAuthStatus();

  if (status === 'authenticated') {
    return <Outlet />;
  }

  if (isChecking) {
    return <AuthGateLoader />;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return null;
}

export function PublicOnlyRoute() {
  return <Outlet />;
}
