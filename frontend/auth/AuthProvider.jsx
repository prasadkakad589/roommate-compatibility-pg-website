import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth.js";
import { clearStoredAuth, getStoredAuth, setStoredAuth } from "../utils/storage.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredAuth()?.token || null);
  const [user, setUser] = useState(() => getStoredAuth()?.user || null);
  const [loading, setLoading] = useState(Boolean(getStoredAuth()?.token));

  const persistAuth = useCallback((auth) => {
    setToken(auth.token);
    setUser(auth.user);
    setStoredAuth(auth);
  }, []);

  const signIn = useCallback(
    async (credentials) => {
      const data = await authApi.login(credentials);
      persistAuth(data);
      return data;
    },
    [persistAuth]
  );

  const signUp = useCallback(
    async (payload) => {
      const data = await authApi.register(payload);
      persistAuth(data);
      return data;
    },
    [persistAuth]
  );

  const signOut = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) return null;
    const me = await authApi.getMe();
    const normalized = {
      ...me,
      id: me._id || me.id,
    };
    setUser(normalized);
    setStoredAuth({ token, user: normalized });
    return normalized;
  }, [token]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await authApi.getMe();
        if (!active) return;
        const normalized = { ...me, id: me._id || me.id };
        setUser(normalized);
        setStoredAuth({ token, user: normalized });
      } catch {
        if (active) signOut();
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [signOut, token]);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      loading,
      refreshMe,
      signIn,
      signOut,
      signUp,
      token,
      user,
    }),
    [loading, refreshMe, signIn, signOut, signUp, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
