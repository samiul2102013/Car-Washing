import { api } from '../api';
import { AUTH_ENDPOINTS } from '../../constants/config';

export interface AuthUser {
  name: string;
  email: string;
  role: 'admin';
  avatarUrl?: string;
}

function toAuthUser(userData: any, email: string): AuthUser {
  const name =
    userData.full_name ||
    userData.name ||
    email.split('@')[0] ||
    'Admin';
  return {
    name,
    email: userData.email || email,
    role: 'admin',
    avatarUrl: userData.avatar || userData.avatar_url || undefined,
  };
}

export const authService = {
  async login(email: string, password: string): Promise<{ tokens: { access: string; refresh?: string }; user: AuthUser } | null> {
    const res: any = await api.post(
      AUTH_ENDPOINTS.LOGIN,
      { email, password },
      { skipAuth: true }
    );

    const tokens = res?.data?.tokens ?? res?.tokens ?? res;
    const access: string | undefined = tokens?.access || tokens?.access_token;
    const refresh: string | undefined = tokens?.refresh || tokens?.refresh_token;

    if (!access) return null;

    const userData = res?.data?.user ?? res?.user ?? {};
    const user = toAuthUser(userData, email);

    return { tokens: { access, refresh }, user };
  },

  async refreshToken(refresh: string): Promise<{ access: string } | null> {
    const res: any = await api.post(
      AUTH_ENDPOINTS.REFRESH,
      { refresh },
      { skipAuth: true }
    );
    if (res?.access) return { access: res.access };
    return null;
  },

  async logout(refresh?: string | null): Promise<void> {
    await api.post(AUTH_ENDPOINTS.LOGOUT, { refresh }).catch(() => {});
  },
};
