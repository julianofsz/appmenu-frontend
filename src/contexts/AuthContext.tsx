import useAuth from '@/hooks/useAuth';
import type { LoginPayload } from '@/types';
import React, { createContext } from 'react';

interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  login: (user: LoginPayload) => Promise<void>;
  logout: () => void;
}

const Context = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { authenticated, loading, login, logout } = useAuth();

  return (
    <Context.Provider value={{ authenticated, loading, login, logout }}>
      {children}
    </Context.Provider>
  );
}

export { Context, AuthProvider };
