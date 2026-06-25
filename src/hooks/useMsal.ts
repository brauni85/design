import { useState, useEffect } from 'react';

interface MockUser {
  name: string;
  email: string;
}

const PLACEHOLDER_CLIENT_ID = '00000000-0000-0000-0000-000000000000';

export function useMsal() {
  const clientId = import.meta.env.VITE_AZURE_CLIENT_ID as string | undefined;
  const isDemoMode = !clientId || clientId === PLACEHOLDER_CLIENT_ID;

  const [isAuthenticated] = useState(true);
  const [isLoading] = useState(false);
  const [user] = useState<MockUser>({
    name: isDemoMode ? 'Demo User' : 'M365 User',
    email: isDemoMode ? 'demo@vfb.de' : '',
  });

  useEffect(() => {
    // In production: initialize MSAL and handle real auth
    // For now, demo mode is always active
  }, []);

  const login = () => {
    if (isDemoMode) {
      console.log('Demo mode: no real login');
      return;
    }
    // real MSAL login would go here
  };

  const logout = () => {
    if (isDemoMode) return;
    // real MSAL logout would go here
  };

  return { isAuthenticated, isLoading, user, login, logout, isDemoMode };
}
