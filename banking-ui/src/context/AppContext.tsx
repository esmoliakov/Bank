import React, { createContext, useContext, useState, useCallback } from "react";
import { AppRoute, UserResponse } from "../types";

// ─── Auth Context ─────────────────────────────────────────────────────────────

interface AuthContextType {
  user:          UserResponse | null;
  setUser:       (u: UserResponse | null) => void;
  isLoggedIn:    boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoggedIn: false,
});

export const useAuth = () => useContext(AuthContext);

// ─── Router Context ───────────────────────────────────────────────────────────

interface RouterContextType {
  route:            AppRoute;
  params:           Record<string, string>;
  navigate:         (route: AppRoute, params?: Record<string, string>) => void;
}

const RouterContext = createContext<RouterContextType>({
  route: "start",
  params: {},
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

// ─── Combined Provider ────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<UserResponse | null>(null);
  const [route, setRoute]     = useState<AppRoute>("start");
  const [params, setParams]   = useState<Record<string, string>>({});

  const navigate = useCallback((r: AppRoute, p: Record<string, string> = {}) => {
    setRoute(r);
    setParams(p);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn: !!user }}>
      <RouterContext.Provider value={{ route, params, navigate }}>
        {children}
      </RouterContext.Provider>
    </AuthContext.Provider>
  );
}
