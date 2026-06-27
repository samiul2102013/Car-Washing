import type { VehicleType } from '../../types';
import { api } from '../api';
import { camelKeys, extractList } from '../helpers';

function mapVehicleType(raw: Record<string, any>): VehicleType {
  return {
    id: raw.id ?? 0,
    name: raw.name ?? '',
    extraPrice: Number(raw.extraPrice ?? 0),
    isActive: raw.isActive ?? raw.is_active ?? true,
    image: raw.image ?? null,
  };
}

export const vehicleTypeService = {
  async list(): Promise<VehicleType[]> {
    const data = await api.get<unknown>('/api/admin/vehicle-types/');
    return extractList(data).map((r) => mapVehicleType(camelKeys(r) as Record<string, any>));
  },

  async add(input: { name: string; extra_price: string; is_active?: boolean }): Promise<VehicleType> {
    const data = await api.post<unknown>('/api/admin/vehicle-types/', input);
    const raw = (data as any)?.data ?? data;
    return mapVehicleType(camelKeys(raw) as Record<string, any>);
  },

  async update(id: number, input: Record<string, unknown>): Promise<VehicleType> {
    const data = await api.patch<unknown>(`/api/admin/vehicle-types/${id}/`, input);
    const raw = (data as any)?.data ?? data;
    return mapVehicleType(camelKeys(raw) as Record<string, any>);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/vehicle-types/${id}/`);
  },
};
