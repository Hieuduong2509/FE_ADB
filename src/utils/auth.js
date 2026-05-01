const AUTH_STORAGE_KEY = "pullman_auth_session";

const normalizeBaseUrl = (rawBaseUrl) => String(rawBaseUrl || "http://localhost:8000").replace(/\/+$/, "");

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

const toError = (status, payload) => {
  const error = new Error(payload?.error?.message || "Request failed");
  error.status = status;
  error.code = payload?.error?.code || null;
  return error;
};

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    throw toError(response.status, payload);
  }

  return payload?.data ?? null;
};

export const registerClientApi = async (formData) =>
  requestJson("/api/client/auth/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });

export const loginClientApi = async (formData) =>
  requestJson("/api/client/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });

export const getClientProfileApi = async (accessToken) =>
  requestJson("/api/client/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const persistAuthSession = (sessionData) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
};

export const readAuthSession = () => {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue);
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const isAdminSession = (session) => session?.user?.role === "admin";
