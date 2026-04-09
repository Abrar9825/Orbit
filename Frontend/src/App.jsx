import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import CardsPage from './features/cards/CardsPage';
import ConfigurationPage from './features/configuration/ConfigurationPage';
import ConfigurationViewPage from './features/configuration/ConfigurationViewPage';
import StockManagementPage from './features/stock/StockManagementPage';
import StockAssetsPage from './features/stock/StockAssetsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/cards" element={<CardsPage />} />
      <Route path="/stock" element={<StockManagementPage />} />
      <Route path="/stock/assets" element={<StockAssetsPage />} />
      <Route path="/07_stock_management.html" element={<Navigate to="/stock" replace />} />
      <Route path="/03_stock_assets.html" element={<Navigate to="/stock/assets" replace />} />
      <Route path="/10.1_configuration_view.html" element={<Navigate to="/configuration/view" replace />} />
      <Route path="/10_configuration.html" element={<Navigate to="/configuration" replace />} />
      <Route path="/configuration" element={<ConfigurationPage />} />
      <Route path="/configuration/view" element={<ConfigurationViewPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;