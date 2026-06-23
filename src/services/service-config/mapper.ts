import type { Service } from '../../types';

type AnyRec = Record<string, any>;

export function mapService(raw: AnyRec): Service {
  return {
    id: String(raw.id ?? ''),
    name: raw.name || '',
    basePrice: Number(raw.basePrice ?? 0),
    description: raw.description || '',
    isActive: raw.isActive ?? raw.active ?? true,
    vehicleType: raw.vehicleType ?? null,
    engineType: raw.engineType ?? null,
    image: raw.image ?? null,
    order: raw.order ?? 0,
  };
}
