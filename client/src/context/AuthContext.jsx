import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem("shopwise-session") || "null"));
  const [checking, setChecking] = useState(Boolean(session));
  useEffect(() => {
    if (!session?.token) return;
    authApi.me(session.token).then(({ user }) => {
      const next = { ...session, user };
      setSession(next);
      localStorage.setItem("shopwise-session", JSON.stringify(next));
    }).catch(() => {
      localStorage.removeItem("shopwise-session");
      setSession(null);
    }).finally(() => setChecking(false));
  }, []);
  async function signIn(credentials) { const next = await authApi.login(credentials); localStorage.setItem("shopwise-session", JSON.stringify(next)); setSession(next); }
  async function signUp(details) { const next = await authApi.register(details); localStorage.setItem("shopwise-session", JSON.stringify(next)); setSession(next); }
  function signOut() { localStorage.removeItem("shopwise-session"); setSession(null); }
  const value = useMemo(() => ({ session, checking, signIn, signUp, signOut }), [session, checking]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
