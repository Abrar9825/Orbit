import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_CARDS } from './cards.model';
import { clearAuthSession, getStoredWorker } from '../../services/authStorage';

const LEGACY_ROUTE_MAP = {
  '07_stock_management.html': '/stock',
  '/07_stock_management.html': '/stock',
  '03_stock_assets.html': '/stock/assets',
  '/03_stock_assets.html': '/stock/assets',
  '10_configuration.html': '/configuration',
  '/10_configuration.html': '/configuration',
  '10.1_configuration_view.html': '/configuration/view',
  '/10.1_configuration_view.html': '/configuration/view'
};

function resolveCardTarget(target) {
  if (typeof target !== 'string') {
    return '';
  }

  const trimmedTarget = target.trim();
  if (!trimmedTarget) {
    return '';
  }

  return LEGACY_ROUTE_MAP[trimmedTarget] || trimmedTarget;
}

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
    const resolvedTarget = resolveCardTarget(target);

    if (resolvedTarget.startsWith('/')) {
      navigate(resolvedTarget);
      return;
    }

    if (resolvedTarget) {
      window.location.assign(resolvedTarget);
    }
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
