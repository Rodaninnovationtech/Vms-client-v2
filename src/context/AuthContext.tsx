import { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "@/types";
import { authService } from "@/service/authService";
import { tokenStorage, userStorage } from "@/utils/storage";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginId: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => userStorage.getUser<User>());
  const [isLoading, setIsLoading] = useState(false);

  // interceptor.tsx clears storage and fires this event on any 401 — pick it
  // up here so React state updates and ProtectedRoute redirects client-side,
  // with no full page reload (and no lost Network tab).
  useEffect(() => {
    const handleAuthExpired = () => setUser(null);
    window.addEventListener("vms:auth-expired", handleAuthExpired);
    return () => window.removeEventListener("vms:auth-expired", handleAuthExpired);
  }, []);

  const login = async (
    loginId: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ login_id: loginId, password });

      if (response.success) {
        const { access_token, refresh_token, ...userData } = response.data;

        tokenStorage.setTokens(access_token, refresh_token);
        const loggedInUser: User = userData as User;
        userStorage.setUser(userData);
        setUser(loggedInUser);

        return { success: true, message: response.message };
      }

      return { success: false, message: response.message || "Login failed" };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Invalid Login ID or Password";
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error: any) {
      console.error(
        "[AuthContext] Logout API failed:",
        error?.response?.data || error?.message || error
      );
    } finally {
      tokenStorage.clearTokens();
      userStorage.clearUser();
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isLoading, login, logout }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};