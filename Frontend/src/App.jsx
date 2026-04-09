import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import CardsPage from './features/cards/CardsPage';
import ConfigurationPage from './features/configuration/ConfigurationPage';
import ConfigurationViewPage from './features/configuration/ConfigurationViewPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/cards" element={<CardsPage />} />
      <Route path="/10.1_configuration_view.html" element={<Navigate to="/configuration/view" replace />} />
      <Route path="/10_configuration.html" element={<Navigate to="/configuration" replace />} />
      <Route path="/configuration" element={<ConfigurationPage />} />
      <Route path="/configuration/view" element={<ConfigurationViewPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;