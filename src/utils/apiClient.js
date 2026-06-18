let accessToken = null;
let refreshPromise = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

/** Endpoints that should never trigger a silent refresh retry */
const AUTH_ENDPOINTS = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/refresh', '/api/v1/auth/logout'];

/**
 * Standardized API client for the frontend.
 * Automatically handles the Authorization header, credentials, and base JSON parsing.
 * On 401, attempts a silent token refresh and retries the original request once.
 */
export async function apiClient(endpoint, options = {}, _isRetry = false) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    defaultHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const config = {
    ...options,
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Allow browser to set the correct Content-Type with boundary for FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const BASE_URL = import.meta.env.VITE_API_URL || '';
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const response = await fetch(url, config);
  let data;
  
  // Try to parse JSON response
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  // On 401, attempt a silent refresh (once) for non-auth endpoints
  if (response.status === 401 && !_isRetry && !AUTH_ENDPOINTS.some(e => endpoint.startsWith(e))) {
    if (!refreshPromise) {
      refreshPromise = fetch(`${BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }).then(async (res) => {
        if (!res.ok) throw new Error('Refresh failed');
        const refreshData = await res.json();
        if (!refreshData.success || !refreshData.data?.accessToken) {
          throw new Error('No access token in refresh response');
        }
        return refreshData.data.accessToken;
      }).finally(() => {
        refreshPromise = null;
      });
    }

    try {
      const newAccessToken = await refreshPromise;
      setAccessToken(newAccessToken);
      // Retry the original request with the new token
      return await apiClient(endpoint, options, true);
    } catch (refreshErr) {
      // Refresh failed completely (e.g. invalid/expired refresh token)
      setAccessToken(null);
      // Stop the loop by redirecting out of the protected admin area
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!response.ok) {
    let errorMsg = data?.error?.message || response.statusText;
    if (data?.error?.details && Array.isArray(data.error.details)) {
      const detailMessages = data.error.details.map(d => d.message).join(', ');
      errorMsg = `${errorMsg}: ${detailMessages}`;
    }
    throw new Error(errorMsg);
  }

  return data;
}
