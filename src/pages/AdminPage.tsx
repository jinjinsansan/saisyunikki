import React, { useState } from 'react';
import SakuraAdminLogin from '../components/SakuraAdminLogin';
import SakuraAdminDashboard from '../components/SakuraAdminDashboard';
import { isAuthenticated } from '../lib/sakuraApi';

const AdminPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  if (!authenticated) {
    return <SakuraAdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <SakuraAdminDashboard />;
};

export default AdminPage;