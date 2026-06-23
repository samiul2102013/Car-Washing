// Centralized API client for the CarWash admin backend.
// All endpoints are prefixed with API_BASE_URL (see constants/config.ts).
// Protected calls automatically attach the stored JWT access token.

import { API_BASE_URL } from '../constants/config';

// ---------------------------------------------------------------------------
// Token storage (localStorage, client-only)
// ---------------------------------------------------------------------------
const TOKEN_KEY = 'carwash_access_token';
const REFRESH_KEY = 'carwash_refresh_token';
const SESSION_KEY = 'carwash_admin_session';

export const tokenStorage = {
  getAccess(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  getRefresh(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set(access: string, refresh?: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(SESSION_KEY);
  },
};

// ---------------------------------------------------------------------------
// Auth-failure handling
// Allows AuthProvider to register a callback so a failed refresh forces logout
// without creating a circular import.
// ---------------------------------------------------------------------------
let authFailureHandler: (() => void) | null = null;

export function setAuthFailureHandler(fn: () => void) {
  authFailureHandler = fn;
}

// ---------------------------------------------------------------------------
// Error type
// ---------------------------------------------------------------------------
export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ---------------------------------------------------------------------------
// Query param helper
// ---------------------------------------------------------------------------
function buildQuery(params?: Record<string, string | number | boolean | undefined | null>): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  );
  if (entries.length === 0) return '';
  const usp = new URLSearchParams();
  for (const [k, v] of entries) usp.append(k, String(v));
  return `?${usp.toString()}`;
}

// ---------------------------------------------------------------------------
// Refresh handling
// ---------------------------------------------------------------------------
let isRefreshing = false;

async function tryRefresh(): Promise<boolean> {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return false;

  if (isRefreshing) return false;
  isRefreshing = true;
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data?.access) {
      tokenStorage.set(data.access, refresh);
      return true;
    }
    return false;
  } catch {
    return false;
  } finally {
    isRefreshing = false;
  }
}

// ---------------------------------------------------------------------------
// Core request
// ---------------------------------------------------------------------------
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  // When true, skip attaching the access token (used by login/refresh).
  skipAuth?: boolean;
  // When true, allow a single refresh+retry on 401 (default true for GETs).
  retryOn401?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, skipAuth = false, retryOn401 = true } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!skipAuth) {
    const token = tokenStorage.getAccess();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${path}${buildQuery(params)}`;
  const init: RequestInit = {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (networkErr) {
    throw new ApiError(
      'Network error — unable to reach the server. Check your connection or API base URL.',
      0,
      networkErr
    );
  }

  // 401 → attempt a single token refresh, then retry once.
  if (res.status === 401 && retryOn401 && !skipAuth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const token = tokenStorage.getAccess();
      if (token) headers['Authorization'] = `Bearer ${token}`;
      res = await fetch(url, { ...init, headers });
    } else {
      tokenStorage.clear();
      authFailureHandler?.();
      throw new ApiError('Session expired. Please sign in again.', 401);
    }
  }

  if (!res.ok) {
    let errData: unknown = null;
    try {
      errData = await res.json();
    } catch {
      // non-JSON error body
    }
    // Backend uses a custom envelope {success,message,...}; fall back to DRF
    // {detail: ...} or a generic message.
    const message = extractErrorMessage(errData) ?? `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, errData);
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return undefined as T;
  }
  const json = await res.json();
  // Unwrap the custom backend envelope: {success, message, data, ...}.
  // When `data` is present we return it directly so callers get the payload.
  if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
    return json.data as T;
  }
  return json as T;
}

// Pull a human-readable message out of either the custom envelope or DRF shape.
function extractErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const obj = data as Record<string, unknown>;
  if (typeof obj.message === 'string') return obj.message;
  if (typeof obj.detail === 'string') return obj.detail;
  // DRF field-level validation errors, e.g. {"email": ["This field is required."]}
  const firstField = Object.values(obj).find((v) => Array.isArray(v) && v.length > 0);
  if (Array.isArray(firstField) && typeof firstField[0] === 'string') {
    return String(firstField[0]);
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Public client
// ---------------------------------------------------------------------------
export const api = {
  get<T>(path: string, params?: RequestOptions['params']) {
    return request<T>(path, { method: 'GET', params });
  },
  post<T>(path: string, body?: unknown, opts?: Pick<RequestOptions, 'skipAuth'>) {
    return request<T>(path, { method: 'POST', body, ...opts });
  },
  patch<T>(path: string, body?: unknown) {
    return request<T>(path, { method: 'PATCH', body });
  },
  put<T>(path: string, body?: unknown) {
    return request<T>(path, { method: 'PUT', body });
  },
  delete<T>(path: string) {
    return request<T>(path, { method: 'DELETE' });
  },
};
