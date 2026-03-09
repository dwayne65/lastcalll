import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { api, setTokens, clearTokens, getAccessToken } from "@/lib/api-client";
import type {
  AuthUser,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/lib/api-types";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("lcm_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    api
      .get<User>("/users/me")
      .then((u) => {
        const authUser: AuthUser = {
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
          avatarUrl: u.avatarUrl,
        };
        setUser(authUser);
        localStorage.setItem("lcm_user", JSON.stringify(authUser));
      })
      .catch(() => {
        clearTokens();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    setTokens(res.accessToken, res.refreshToken);
    // Fetch full user profile
    const u = await api.get<User>("/users/me");
    const authUser: AuthUser = {
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      avatarUrl: u.avatarUrl,
    };
    setUser(authUser);
    localStorage.setItem("lcm_user", JSON.stringify(authUser));
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const res = await api.post<AuthResponse>("/auth/register", data);
    setTokens(res.accessToken, res.refreshToken);
    const u = await api.get<User>("/users/me");
    const authUser: AuthUser = {
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      avatarUrl: u.avatarUrl,
    };
    setUser(authUser);
    localStorage.setItem("lcm_user", JSON.stringify(authUser));
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
