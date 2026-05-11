const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const buildHeaders = (token, hasBody) => {
  const headers = {};

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const getApiBaseUrl = () => API_BASE_URL;

export const apiRequest = async (path, options = {}) => {
  const { token, body, ...restOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      ...buildHeaders(token, body !== undefined),
      ...(restOptions.headers || {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const responseText = await response.text();
  let payload = null;

  try {
    payload = responseText ? JSON.parse(responseText) : null;
  } catch {
    payload = responseText;
  }

  if (!response.ok) {
    const error = new Error(
      payload?.error?.message || payload?.message || `Request failed with status ${response.status}`,
    );
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};
