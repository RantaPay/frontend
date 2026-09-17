import { useState, useEffect } from "react";
import { setActiveSchool } from "./store";

const AUTH_KEY = "rantapay-auth";
const SUPER_ADMIN_KEY = "rantapay-super-admin";

export function login(email: string, schoolId?: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, email);
    if (schoolId) setActiveSchool(schoolId);
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(SUPER_ADMIN_KEY);
  }
}

export function useAuth() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEmail(localStorage.getItem(AUTH_KEY));
    setReady(true);
    const onStorage = () => setEmail(localStorage.getItem(AUTH_KEY));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { email, isAuthed: !!email, ready };
}

export function loginSuperAdmin(email: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SUPER_ADMIN_KEY, email);
  }
}

export function useSuperAdminAuth() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEmail(localStorage.getItem(SUPER_ADMIN_KEY));
    setReady(true);
    const onStorage = () => setEmail(localStorage.getItem(SUPER_ADMIN_KEY));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { email, isSuperAdmin: !!email, ready };
}

