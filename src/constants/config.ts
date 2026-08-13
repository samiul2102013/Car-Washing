// Central API configuration.
// Base URL of the CarWash Django REST backend.
// Override per-environment via NEXT_PUBLIC_API_BASE_URL in .env / .env.local.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.rinceapp.com';

// Auth endpoints (SimpleJWT style — adjust here if backend differs).
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login/',
  REFRESH: '/api/auth/token/refresh/',
  LOGOUT: '/api/auth/logout/',
  ME: '/api/auth/me/',
  CHANGE_PASSWORD: '/api/auth/change-password/',
} as const;
