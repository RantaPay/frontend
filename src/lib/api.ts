import { getAuthToken, clearAuthSession } from "./auth";

const rawBaseUrl = import.meta.env.VITE_API_URL || "";
export const API_BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: any;
}

/**
 * Centralized API client for all network calls
 */
export async function apiRequest<T = any>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}${normalizedPath}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let body: any = options.body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });

  // Handle 401 Unauthorized globally for protected routes
  if (response.status === 401 && typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    const isPublic =
      currentPath === "/" ||
      currentPath.startsWith("/pay") ||
      currentPath.startsWith("/receipt") ||
      currentPath.startsWith("/verify") ||
      currentPath === "/login" ||
      currentPath === "/school/login" ||
      currentPath === "/admin/login" ||
      currentPath === "/school/register";

    if (!isPublic) {
      clearAuthSession();
      if (currentPath.startsWith("/admin")) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/school/login";
      }
    }
  }

  let data: any;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (data && typeof data === "object" && (data.error || data.message)) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
}

export function apiGet<T = any>(path: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "GET" });
}

export function apiPost<T = any>(path: string, body?: any, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "POST", body });
}

export function apiPut<T = any>(path: string, body?: any, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "PUT", body });
}

export function apiPatch<T = any>(path: string, body?: any, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "PATCH", body });
}

export function apiDelete<T = any>(path: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "DELETE" });
}
