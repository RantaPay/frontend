import { useState, useEffect } from "react";
import { setActiveSchool } from "./store";

export interface AuthUser {
  id?: string;
  email: string;
  role: "Bursar" | "SuperAdmin";
  schoolId?: string;
  schoolName?: string;
}

const AUTH_TOKEN_KEY = "rantapay-token";
const AUTH_USER_KEY = "rantapay-user";
const AUTH_KEY = "rantapay-auth";
const SUPER_ADMIN_KEY = "rantapay-super-admin";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: AuthUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_KEY, user.email);
    if (user.role === "SuperAdmin") {
      localStorage.setItem(SUPER_ADMIN_KEY, user.email);
    }
    if (user.schoolId) {
      setActiveSchool(user.schoolId);
    }
    window.dispatchEvent(new Event("storage"));
  }
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(SUPER_ADMIN_KEY);
    window.dispatchEvent(new Event("storage"));
  }
}

export function login(email: string, schoolId?: string, token?: string) {
  const user: AuthUser = {
    email,
    role: "Bursar",
    schoolId,
  };
  setAuthSession(token || `token_${Date.now()}`, user);
}

export function loginSuperAdmin(email: string, token?: string) {
  const user: AuthUser = {
    email,
    role: "SuperAdmin",
  };
  setAuthSession(token || `token_${Date.now()}`, user);
}

export const logout = clearAuthSession;

export function useAuth() {
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [user, setUser] = useState<AuthUser | null>(getAuthUser());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const update = () => {
      setToken(getAuthToken());
      setUser(getAuthUser());
      setReady(true);
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  return {
    token,
    user,
    email: user?.email ?? null,
    role: user?.role ?? null,
    schoolId: user?.schoolId ?? null,
    isAuthed: !!token,
    isBursar: !!token && user?.role === "Bursar",
    isSuperAdmin: !!token && user?.role === "SuperAdmin",
    ready,
  };
}

export function useSuperAdminAuth() {
  const { user, isSuperAdmin, ready } = useAuth();
  return {
    email: user?.email ?? null,
    isSuperAdmin,
    ready,
  };
}
