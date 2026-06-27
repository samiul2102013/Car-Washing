import type { DirtLevel } from '../../types';
import { api } from '../api';
import { camelKeys, extractList } from '../helpers';

function mapDirtLevel(raw: Record<string, any>): DirtLevel {
  return {
    id: raw.id ?? 0,
    level: raw.level ?? 'light',
    description: raw.description ?? '',
    extraPrice: Number(raw.extraPrice ?? raw.extra_price ?? 0),
  };
}

export const dirtLevelService = {
  async list(): Promise<DirtLevel[]> {
    const data = await api.get<unknown>('/api/admin/dirt-levels/');
    return extractList(data).map((r) => mapDirtLevel(camelKeys(r) as Record<string, any>));
  },

  async add(input: { level: string; description?: string; extra_price: string }): Promise<DirtLevel> {
    const data = await api.post<unknown>('/api/admin/dirt-levels/', input);
    const raw = (data as any)?.data ?? data;
    return mapDirtLevel(camelKeys(raw) as Record<string, any>);
  },

  async update(id: number, input: Record<string, unknown>): Promise<DirtLevel> {
    const data = await api.patch<unknown>(`/api/admin/dirt-levels/${id}/`, input);
    const raw = (data as any)?.data ?? data;
    return mapDirtLevel(camelKeys(raw) as Record<string, any>);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/admin/dirt-levels/${id}/`);
  },
};
