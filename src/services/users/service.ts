import type { ProviderDocument, User, UserStatus } from '../../types';
import { api } from '../api';
import { camelKeys, extractList } from '../helpers';
import { mapUser } from './mapper';

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
}

export const userService = {
  async getUsers(filters?: UserFilters): Promise<User[]> {
    const data = await api.get<unknown>('/api/admin/users/', {
      role: filters?.role,
      status: filters?.status,
      search: filters?.search,
    });
    const list = extractList(data);
    return list.map((r) => mapUser(camelKeys(r) as Record<string, any>));
  },

  async getUserById(id: string): Promise<User | undefined> {
    const res = await api.get<Record<string, any>>(`/api/admin/users/${id}/`);
    const data = res?.data ?? res;
    return mapUser(camelKeys(data) as Record<string, any>);
  },

  async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    if (status === 'suspended') {
      await api.post(`/api/admin/users/${id}/block/`);
    } else if (status === 'active') {
      await api.post(`/api/admin/users/${id}/unblock/`);
    } else {
      await api.patch(`/api/admin/users/${id}/`, { status });
    }
    const fresh = await this.getUserById(id);
    return fresh ?? ({ id, status } as User);
  },

  async blockUser(id: string): Promise<void> {
    await api.post(`/api/admin/users/${id}/block/`);
  },

  async unblockUser(id: string): Promise<void> {
    await api.post(`/api/admin/users/${id}/unblock/`);
  },

  async approveProvider(id: string): Promise<void> {
    await api.post(`/api/admin/providers/${id}/approve/`);
  },

  async rejectProvider(id: string): Promise<void> {
    await api.post(`/api/admin/providers/${id}/reject/`);
  },

  async getProviderDocuments(id: string): Promise<ProviderDocument[]> {
    const data = await api.get<unknown>(`/api/admin/providers/${id}/documents/`);
    const list = extractList(data);
    return list.map((r) => {
      const doc = camelKeys(r) as Record<string, any>;
      return {
        id: doc.id,
        docType: doc.docType ?? '',
        file: doc.file ?? '',
        status: doc.status ?? 'pending',
        adminNote: doc.adminNote ?? '',
        uploadedAt: doc.uploadedAt ?? '',
        reviewedAt: doc.reviewedAt ?? null,
      } as ProviderDocument;
    });
  },

  async reviewDocument(
    documentId: string,
    status: 'approved' | 'rejected',
    adminNote: string
  ): Promise<void> {
    await api.post(`/api/admin/documents/${documentId}/review/`, {
      status,
      admin_note: adminNote,
    });
  },
};
