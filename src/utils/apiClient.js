let accessToken = null;

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
    try {
      const refreshUrl = `${BASE_URL}/api/v1/auth/refresh`;
      const refreshRes = await fetch(refreshUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const refreshData = await refreshRes.json();
      if (refreshRes.ok && refreshData.success && refreshData.data?.accessToken) {
        setAccessToken(refreshData.data.accessToken);
        // Retry the original request with the new token
        return apiClient(endpoint, options, true);
      }
    } catch (refreshErr) {
      // Refresh failed — fall through to error below
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
