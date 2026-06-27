import { api, tokenStorage } from '../api';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../../constants/config';

export interface AuthUser {
  name: string;
  email: string;
  role: 'admin';
  avatarUrl?: string;
  phone?: string;
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
    phone: userData.phone || undefined,
  };
}

export interface AdminProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  language: string;
  createdAt: string;
}

function mapProfile(raw: Record<string, any>): AdminProfile {
  return {
    id: raw.id ?? 0,
    fullName: raw.fullName ?? raw.full_name ?? '',
    email: raw.email ?? '',
    phone: raw.phone ?? '',
    avatar: raw.avatar ?? undefined,
    role: raw.role ?? '',
    isVerified: raw.isVerified ?? raw.is_verified ?? false,
    language: raw.language ?? 'en',
    createdAt: raw.createdAt ?? raw.created_at ?? '',
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

  async getProfile(): Promise<AdminProfile> {
    const res = await api.get<any>(AUTH_ENDPOINTS.ME);
    const raw = res?.data ?? res;
    return mapProfile(raw);
  },

  async updateProfile(payload: { full_name: string; email?: string; phone?: string }): Promise<AdminProfile> {
    const res = await api.patch<any>(AUTH_ENDPOINTS.ME, payload);
    const raw = res?.data ?? res;
    return mapProfile(raw);
  },

  async changePassword(payload: { old_password: string; new_password: string; confirm_password: string }): Promise<void> {
    await api.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, payload);
  },

  async updateProfileWithAvatar(data: { full_name: string; email?: string; phone?: string; avatar?: File }): Promise<AdminProfile> {
    const fd = new FormData();
    fd.append('full_name', data.full_name);
    if (data.email) fd.append('email', data.email);
    if (data.phone) fd.append('phone', data.phone);
    if (data.avatar) fd.append('avatar', data.avatar, data.avatar.name);

    const res = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.ME}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenStorage.getAccess()}` },
      body: fd,
    });

    if (!res.ok) throw new Error('Failed to update profile with avatar');
    const json = await res.json();
    const raw = json?.data ?? json;
    return mapProfile(raw);
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
