import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import { ProtectedRoute, PublicOnlyRoute } from './features/auth/AuthRouteGuards';
import CardsPage from './features/cards/CardsPage';
import ConfigurationPage from './features/configuration/ConfigurationPage';
import ConfigurationViewPage from './features/configuration/ConfigurationViewPage';
import StockManagementPage from './features/stock/StockManagementPage';
import StockAssetsPage from './features/stock/StockAssetsPage';

const LEGACY_PATH_MAP = {
  '/07_stock_management.html': '/stock',
  '/03_stock_assets.html': '/stock/assets',
  '/10_configuration.html': '/configuration',
  '/10.1_configuration_view.html': '/configuration/view'
};

function LegacyPathRedirect() {
  const location = useLocation();
  const lowerPath = (location.pathname || '').toLowerCase();

  const match = Object.entries(LEGACY_PATH_MAP).find(([legacyPath]) =>
    lowerPath === legacyPath || lowerPath.endsWith(legacyPath)
  );

  if (!match) {
    return null;
  }

  const [, targetPath] = match;
  const target = `${targetPath}${location.search || ''}${location.hash || ''}`;
  return <Navigate to={target} replace />;
}

function App() {
  return (
    <>
      <LegacyPathRedirect />

      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/stock" element={<StockManagementPage />} />
          <Route path="/stock/assets" element={<StockAssetsPage />} />
          <Route path="/07_stock_management.html" element={<Navigate to="/stock" replace />} />
          <Route path="/03_stock_assets.html" element={<Navigate to="/stock/assets" replace />} />
          <Route path="/10.1_configuration_view.html" element={<Navigate to="/configuration/view" replace />} />
          <Route path="/10_configuration.html" element={<Navigate to="/configuration" replace />} />
          <Route path="/configuration" element={<ConfigurationPage />} />
          <Route path="/configuration/view" element={<ConfigurationViewPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;