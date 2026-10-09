import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError, api, clearToken, getToken, setToken } from "./api";
import type { User } from "./types";

type AuthValue = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => void };
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(getToken()));
  useEffect(() => {
    const unauthorized = () => { clearToken(); setUser(null); setLoading(false); };
    window.addEventListener("helpdesk:unauthorized", unauthorized);
    if (getToken()) api.me().then(setUser).catch((error) => {
      if (error instanceof ApiError && error.status === 401) unauthorized();
    }).finally(() => setLoading(false));
    return () => window.removeEventListener("helpdesk:unauthorized", unauthorized);
  }, []);
  const value = useMemo<AuthValue>(() => ({
    user, loading,
    async login(email, password) {
      const result = await api.login(email, password);
      setToken(result.token);
      setUser(result.user);
    },
    logout() { clearToken(); setUser(null); },
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
