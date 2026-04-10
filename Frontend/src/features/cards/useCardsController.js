import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_CARDS } from './cards.model';
import { clearAuthSession, getStoredWorker } from '../../services/authStorage';

export default function useCardsController() {
  const navigate = useNavigate();

  const workerName = useMemo(() => {
    const worker = getStoredWorker();
    return (worker?.userName || worker?.name || 'User').toString();
  }, []);

  const workerInitial = useMemo(() => workerName.trim().charAt(0).toUpperCase() || 'U', [workerName]);

  useEffect(() => {
    document.title = 'Dashboard - Orbit';
  }, []);

  const cards = useMemo(() => DASHBOARD_CARDS, []);

  const onOpenCard = (target) => {
    if (typeof target === 'string' && target.startsWith('/')) {
      navigate(target);
      return;
    }

    window.location.assign(target);
  };

  const onSignOut = () => {
    clearAuthSession();
    navigate('/', { replace: true });
  };

  return {
    cards,
    workerName,
    workerInitial,
    onOpenCard,
    onSignOut
  };
}
