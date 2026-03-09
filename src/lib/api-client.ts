import type { AuthResponse } from "./api-types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

// ─── Token Storage ─────────────────────────────────────────
let accessToken: string | null = localStorage.getItem("lcm_access_token");
let refreshToken: string | null = localStorage.getItem("lcm_refresh_token");

export function getAccessToken() {
  return accessToken;
}

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem("lcm_access_token", access);
  localStorage.setItem("lcm_refresh_token", refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("lcm_access_token");
  localStorage.removeItem("lcm_refresh_token");
  localStorage.removeItem("lcm_user");
}

// ─── Core Fetch Wrapper ────────────────────────────────────
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData (browser sets boundary automatically)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Try token refresh on 401
  if (res.status === 401 && refreshToken && !endpoint.includes("/auth/")) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      const retry = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
      if (retry.ok) {
        return retry.status === 204 ? (undefined as T) : retry.json();
      }
    }
    clearTokens();
    window.location.href = "/admin/login";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || res.statusText, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  try {
    // Decode userId from current access token
    const payload = JSON.parse(atob(accessToken!.split(".")[1]));
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: payload.sub, refreshToken }),
    });
    if (!res.ok) return false;
    const data: AuthResponse = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── HTTP Helpers ──────────────────────────────────────────
export const api = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, data?: unknown) =>
    request<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(url: string, data?: unknown) =>
    request<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(url: string, data?: unknown) =>
    request<T>(url, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),

  upload: <T>(url: string, formData: FormData) =>
    request<T>(url, { method: "POST", body: formData }),
};
