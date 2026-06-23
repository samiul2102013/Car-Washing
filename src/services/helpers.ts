export function camelKeys<T = Record<string, unknown>>(obj: unknown): T {
  if (obj === null || typeof obj !== 'object') return obj as T;
  if (Array.isArray(obj)) return obj.map(camelKeys) as unknown as T;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const camel = k.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
    out[camel] = camelKeys(v);
  }
  return out as T;
}

export function extractList(data: unknown): Record<string, any>[] {
  if (Array.isArray(data)) return data as Record<string, any>[];
  if (data && typeof data === 'object') {
    const obj = data as Record<string, any>;
    if (Array.isArray(obj.results)) return obj.results;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.items)) return obj.items;
  }
  return [];
}

export class ApiNotSupported extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiNotSupported';
  }
}
