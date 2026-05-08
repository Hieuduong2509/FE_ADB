const AUTH_STORAGE_KEY = "pullman_auth_session";

const normalizeBaseUrl = (rawBaseUrl) => String(rawBaseUrl || "http://localhost:8000").replace(/\/+$/, "");

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

const parseJwtPayload = (token) => {
  try {
    const [, payload = ""] = String(token || "").split(".");
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = window.atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const isExpiredToken = (token) => {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
};

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
    if (response.status === 401) {
      clearAuthSession();
    }
    throw toError(response.status, payload);
  }

  return payload?.data ?? null;
};

const withAuthHeaders = (accessToken, headers = {}) => ({
  ...headers,
  ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
});

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

export const loginAdminApi = async (formData) =>
  requestJson("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });

export const getClientProfileApi = async (accessToken) =>
  requestJson("/api/client/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getClientHotelsApi = async (filters) =>
  requestJson(`/api/client/hotels?${new URLSearchParams(filters).toString()}`);

export const getClientHotelDetailApi = async (hotelId, filters) =>
  requestJson(`/api/client/hotels/${hotelId}?${new URLSearchParams(filters).toString()}`);

export const getBookingQuoteApi = async (payload) =>
  requestJson("/api/booking/quote", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const createBookingApi = async (payload, accessToken) =>
  requestJson("/api/booking", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const getAdminHotelsApi = async () => requestJson("/api/admin/hotels?limit=100");

export const getAdminCountriesApi = async () => requestJson("/api/admin/country?limit=100");

export const createAdminCountryApi = async (payload, accessToken) =>
  requestJson("/api/admin/country", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const updateAdminCountryApi = async (id, payload, accessToken) =>
  requestJson(`/api/admin/country/${id}`, {
    method: "PUT",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminCountryApi = async (id, accessToken) =>
  requestJson(`/api/admin/country/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const createAdminHotelApi = async (payload, accessToken) =>
  requestJson("/api/admin/hotels", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const updateAdminHotelApi = async (id, payload, accessToken) =>
  requestJson(`/api/admin/hotels/${id}`, {
    method: "PUT",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminHotelApi = async (id, accessToken) =>
  requestJson(`/api/admin/hotels/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const getAdminRoomTypesApi = async () => requestJson("/api/admin/room-type?limit=100");

export const createAdminRoomTypeApi = async (payload, accessToken) =>
  requestJson("/api/admin/room-type", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const updateAdminRoomTypeApi = async (id, payload, accessToken) =>
  requestJson(`/api/admin/room-type/${id}`, {
    method: "PUT",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminRoomTypeApi = async (id, accessToken) =>
  requestJson(`/api/admin/room-type/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const getAdminFacilitiesApi = async () => requestJson("/api/admin/facilities?limit=100");

export const createAdminFacilityApi = async (payload, accessToken) =>
  requestJson("/api/admin/facilities", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const updateAdminFacilityApi = async (id, payload, accessToken) =>
  requestJson(`/api/admin/facilities/${id}`, {
    method: "PUT",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminFacilityApi = async (id, accessToken) =>
  requestJson(`/api/admin/facilities/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const getAdminAmenitiesApi = async (filters = {}) =>
  requestJson(`/api/admin/amenities?${new URLSearchParams({ limit: 100, ...filters }).toString()}`);

export const getAdminSeasonalPricingApi = async (filters = {}) =>
  requestJson(`/api/admin/pricing/seasonal-pricing?${new URLSearchParams(filters).toString()}`);

export const createAdminSeasonalPricingApi = async (payload, accessToken) =>
  requestJson("/api/admin/pricing/seasonal-pricing", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const updateAdminSeasonalPricingApi = async (id, payload, accessToken) =>
  requestJson(`/api/admin/pricing/seasonal-pricing/${id}`, {
    method: "PUT",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminSeasonalPricingApi = async (id, accessToken) =>
  requestJson(`/api/admin/pricing/seasonal-pricing/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const getAdminSpecificDatePricingApi = async (filters = {}) =>
  requestJson(
    `/api/admin/pricing/specific-date-pricing?${new URLSearchParams(filters).toString()}`,
  );

export const createAdminSpecificDatePricingApi = async (payload, accessToken) =>
  requestJson("/api/admin/pricing/specific-date-pricing", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const updateAdminSpecificDatePricingApi = async (id, payload, accessToken) =>
  requestJson(`/api/admin/pricing/specific-date-pricing/${id}`, {
    method: "PUT",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminSpecificDatePricingApi = async (id, accessToken) =>
  requestJson(`/api/admin/pricing/specific-date-pricing/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
  });

export const getAdminSearchIndexStatusApi = async (accessToken) =>
  requestJson("/api/admin/search-index", {
    headers: withAuthHeaders(accessToken),
  });

export const rebuildAdminSearchIndexApi = async (payload, accessToken) =>
  requestJson("/api/admin/search-index/rebuild", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const testAdminSearchIndexQueryApi = async (payload, accessToken) =>
  requestJson("/api/admin/search-index/test-query", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const createAdminAmenityApi = async (payload, accessToken) =>
  requestJson("/api/admin/amenities", {
    method: "POST",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const updateAdminAmenityApi = async (id, payload, accessToken) =>
  requestJson(`/api/admin/amenities/${id}`, {
    method: "PUT",
    headers: withAuthHeaders(accessToken),
    body: JSON.stringify(payload),
  });

export const deleteAdminAmenityApi = async (id, accessToken) =>
  requestJson(`/api/admin/amenities/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(accessToken),
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
    const session = JSON.parse(rawValue);
    if (session?.accessToken && isExpiredToken(session.accessToken)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return session;
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
