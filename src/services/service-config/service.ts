import type { Service } from '../../types';
import { api } from '../api';
import { camelKeys, extractList } from '../helpers';
import { mapService } from './mapper';

export const serviceConfigService = {
  async getServices(): Promise<Service[]> {
    const data = await api.get<unknown>('/api/admin/services/');
    const list = extractList(data);
    return list.map((r) => mapService(camelKeys(r) as Record<string, any>));
  },

  async addService(input: {
    name: string;
    description: string;
    basePrice: number;
    isActive?: boolean;
    order?: number;
  }): Promise<Service> {
    const data = await api.post<unknown>('/api/admin/services/', {
      name: input.name,
      description: input.description,
      base_price: String(input.basePrice),
      is_active: input.isActive ?? true,
      order: input.order ?? 0,
    });
    return mapService(camelKeys(data) as Record<string, any>);
  },

  async updateService(input: {
    id: string;
    name?: string;
    description?: string;
    basePrice?: number;
    isActive?: boolean;
    order?: number;
  }): Promise<Service> {
    const body: Record<string, unknown> = {};
    if (input.name !== undefined) body.name = input.name;
    if (input.description !== undefined) body.description = input.description;
    if (input.basePrice !== undefined) body.base_price = String(input.basePrice);
    if (input.isActive !== undefined) body.is_active = input.isActive;
    if (input.order !== undefined) body.order = input.order;
    const data = await api.patch<unknown>(`/api/admin/services/${input.id}/`, body);
    return mapService(camelKeys(data) as Record<string, any>);
  },

  async deleteService(id: string): Promise<void> {
    await api.delete(`/api/admin/services/${id}/`);
  },
};
