import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "../services/auth.service";

import type {
  AuthUser,
  LoginPayload,
} from "../types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

function getStoredUser(): AuthUser | null {
  try {
    const storedUser = sessionStorage.getItem("sia_user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as AuthUser;
  } catch {
    sessionStorage.removeItem("sia_user");
    sessionStorage.removeItem("sia_token");

    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(
    getStoredUser
  );

  const [isLoading, setIsLoading] = useState(
    () => Boolean(sessionStorage.getItem("sia_token"))
  );

  // Validasi sesi ketika aplikasi pertama kali dibuka
  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      const token = sessionStorage.getItem("sia_token");

      if (!token) {
        authService.logout();

        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }

        return;
      }

      try {
        const response = await authService.me();

        if (!isMounted) return;

        const verifiedUser = response.data.user;

        // Perbarui profil berdasarkan database
        sessionStorage.setItem(
          "sia_user",
          JSON.stringify(verifiedUser)
        );

        setUser(verifiedUser);
      } catch {
        // Hapus sesi jika token tidak valid
        authService.logout();

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void validateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Login
  const login = async (
    payload: LoginPayload
  ): Promise<AuthUser> => {
    const response = await authService.login(payload);

    const { token, user } = response.data;

    sessionStorage.setItem("sia_token", token);
    sessionStorage.setItem(
      "sia_user",
      JSON.stringify(user)
    );

    setUser(user);

    return user;
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(
      user && sessionStorage.getItem("sia_token")
    ),
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth harus digunakan di dalam AuthProvider."
    );
  }

  return context;
}
