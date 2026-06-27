import type { EngineType } from '../../types';
import { api } from '../api';
import { camelKeys, extractList } from '../helpers';

function mapEngineType(raw: Record<string, any>): EngineType {
  return {
    id: raw.id ?? 0,
    engineType: raw.engineType ?? raw.engine_type ?? 'petrol',
    discountPercent: Number(raw.discountPercent ?? raw.discount_percent ?? 0),
    description: raw.description ?? '',
  };
}

export const engineTypeService = {
  async list(): Promise<EngineType[]> {
    const data = await api.get<unknown>('/api/admin/engine-types/');
    return extractList(data).map((r) => mapEngineType(camelKeys(r) as Record<string, any>));
  },

  async add(input: { engine_type: string; discount_percent: string; description?: string }): Promise<EngineType> {
    const data = await api.post<unknown>('/api/admin/engine-types/', input);
    const raw = (data as any)?.data ?? data;
    return mapEngineType(camelKeys(raw) as Record<string, any>);
  },

  async update(id: number, input: Record<string, unknown>): Promise<EngineType> {
    const data = await api.patch<unknown>(`/api/admin/engine-types/${id}/`, input);
    const raw = (data as any)?.data ?? data;
    return mapEngineType(camelKeys(raw) as Record<string, any>);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/engine-types/${id}/`);
  },
};
