import type { CarType } from '../../types';
import { MOCK_CAR_TYPES } from '../../constants/mockData';

const isClient = typeof window !== 'undefined';

const KEYS = {
  CAR_TYPES: 'carwash_cartypes',
};

const getOrSet = (key: string, defaultVal: unknown) => {
  if (!isClient) return defaultVal;
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(val);
  } catch {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
};

const saveDB = (key: string, data: unknown) => {
  if (isClient) localStorage.setItem(key, JSON.stringify(data));
};

export const carTypeService = {
  async getCarTypes(): Promise<CarType[]> {
    return getOrSet(KEYS.CAR_TYPES, MOCK_CAR_TYPES);
  },

  async addCarType(name: string, multiplier: number): Promise<CarType> {
    const list = getOrSet(KEYS.CAR_TYPES, MOCK_CAR_TYPES) as CarType[];
    const item: CarType = { id: `ct-${Date.now()}`, name, multiplier, isActive: true };
    saveDB(KEYS.CAR_TYPES, [item, ...list]);
    return item;
  },

  async updateCarType(id: string, multiplier: number, isActive: boolean): Promise<CarType> {
    const list = getOrSet(KEYS.CAR_TYPES, MOCK_CAR_TYPES) as CarType[];
    const next = list.map((c) => (c.id === id ? { ...c, multiplier, isActive } : c));
    saveDB(KEYS.CAR_TYPES, next);
    return next.find((c) => c.id === id)!;
  },

  async deleteCarType(id: string): Promise<void> {
    const list = getOrSet(KEYS.CAR_TYPES, MOCK_CAR_TYPES) as CarType[];
    saveDB(
      KEYS.CAR_TYPES,
      list.filter((c) => c.id !== id)
    );
  },
};
