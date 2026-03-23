// ─── Base URL ─────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Token refresh track — ek baar refresh ho ────
let isRefreshing = false;
let refreshPromise = null;

// ─── Core Request Function ────────────────────────
async function request(endpoint, options = {}, retry = true) {
  const url = `${BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const config = {
    credentials: 'include',
    headers: isFormData
      ? { ...options.headers }
      : {
          'Content-Type': 'application/json',
          ...options.headers,
        },
    ...options,
  };

  if (config.body && !isFormData && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && retry) {
    try {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = fetch(`${BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include',
        }).finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      const refreshRes = await refreshPromise;

      if (refreshRes.ok) {
        return request(endpoint, options, false);
      }
    } catch {
      // Refresh bhi fail — caller ko 401 milega
    }
  }

  if (!res.ok) {
    throw { status: res.status, message: data.message || 'Something went wrong' };
  }

  return data;
}

// ─── HTTP Methods ─────────────────────────────────
export const api = {
  get: (endpoint, options = {}) =>
    request(endpoint, { method: 'GET', ...options }),

  post: (endpoint, body, options = {}) =>
    request(endpoint, { method: 'POST', body, ...options }),

  put: (endpoint, body, options = {}) =>
    request(endpoint, { method: 'PUT', body, ...options }),

  patch: (endpoint, body = {}, options = {}) =>
    request(endpoint, { method: 'PATCH', body, ...options }),

  delete: (endpoint, options = {}) =>
    request(endpoint, { method: 'DELETE', ...options }),

  upload: (endpoint, formData) =>
    request(endpoint, { method: 'POST', body: formData }),
};