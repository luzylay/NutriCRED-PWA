import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import { loginApi } from "../lib/api";
import { ROLE_TO_ROUTE } from "../lib/constants";
import type { AuthUser, UserRole } from "../lib/types";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  isDemoMode: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  registerCaregiver: (data: any) => Promise<boolean>;
  enterDemo: () => void;
  logout: () => void;
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── PROVIDER ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = sessionStorage.getItem("active_token");
    const role = sessionStorage.getItem("active_role") as UserRole | null;
    const username = sessionStorage.getItem("active_username");

    if (token && role && username) {
      return { username, role, token };
    }
    return null;
  });
  const [isDemoMode, setIsDemoMode] = useState(false);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        const data = await loginApi(username, password);
        const authUser: AuthUser = {
          username: data.username,
          role: data.role,
          token: data.access_token,
        };
        sessionStorage.setItem("active_token", data.access_token);
        sessionStorage.setItem("active_role", data.role);
        sessionStorage.setItem("active_username", data.username);
        setUser(authUser);
        setIsDemoMode(false);

        const route = ROLE_TO_ROUTE[data.role] ?? "/familia";
        navigate(route);
        return true;
      } catch {
        // Fallback offline demo auth for development
        const offlineMap: Record<string, UserRole> = {
          maria: "CAREGIVER",
          carlos: "PROFESSIONAL",
          luisa: "COMMUNITY_AGENT",
          admin: "ADMIN",
        };
        const offlinePwd: Record<string, string> = {
          maria: "maria123",
          carlos: "carlos123",
          luisa: "luisa123",
          admin: "admin123",
        };
        if (offlineMap[username] && offlinePwd[username] === password) {
          const role = offlineMap[username];
          const authUser: AuthUser = { username, role, token: "" };
          setUser(authUser);
          sessionStorage.setItem("active_token", "");
          sessionStorage.setItem("active_role", role);
          sessionStorage.setItem("active_username", username);
          setIsDemoMode(false);
          navigate(ROLE_TO_ROUTE[role]);
          return true;
        }
        return false;
      }
    },
    [navigate],
  );

  const enterDemo = useCallback(() => {
    setIsDemoMode(true);
    setUser({ username: "demo", role: "CAREGIVER", token: "" });
    navigate("/familia");
  }, [navigate]);

  const registerCaregiver = useCallback(
    async (data: any): Promise<boolean> => {
      // FAKE REGISTRATION: Save newly registered family to LocalStorage so DataContext can pick it up
      try {
        const newFamily = {
          ...data,
          id: `reg-${Date.now()}`,
          registrationDate: new Date().toISOString(),
        };

        const existing = JSON.parse(
          localStorage.getItem("yanapiri_new_families") ?? "[]",
        );
        existing.push(newFamily);
        localStorage.setItem("yanapiri_new_families", JSON.stringify(existing));

        // Auto login as CAREGIVER
        setUser({ username: data.caregiverDni, role: "CAREGIVER", token: "" });
        setIsDemoMode(false);
        navigate("/familia");
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    [navigate],
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem("active_token");
    sessionStorage.removeItem("active_role");
    sessionStorage.removeItem("active_username");
    setUser(null);
    setIsDemoMode(false);
    navigate("/");
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isDemoMode,
        isLoggedIn: user !== null,
        login,
        registerCaregiver,
        enterDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── HOOK ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
