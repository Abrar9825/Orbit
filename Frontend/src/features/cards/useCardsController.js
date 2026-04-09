import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_CARDS } from './cards.model';

export default function useCardsController() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('orbitAuthToken');

    if (!token) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    document.title = 'Dashboard - Orbit';
  }, []);

  const cards = useMemo(() => DASHBOARD_CARDS, []);

  const onOpenCard = (target) => {
    if (typeof target === 'string' && target.startsWith('/')) {
      navigate(target);
      return;
    }

    window.location.href = target;
  };

  const onSignOut = () => {
    localStorage.removeItem('orbitAuthToken');
    localStorage.removeItem('orbitWorker');
    window.location.href = '/';
  };

  return {
    cards,
    onOpenCard,
    onSignOut
  };
}
