import { api } from '../api';
import { camelKeys } from '../helpers';
import { mapEarningStats, mapEarningTransaction } from './mapper';
import type { DashboardStats, EarningStats, EarningTransaction } from '../../types';

interface EarningsDashboardData {
  stats: DashboardStats;
  chartData: EarningStats[];
  transactions: EarningTransaction[];
}

export const earningService = {
  async getEarningsDashboard(): Promise<EarningsDashboardData> {
    const raw = await api.get<unknown>('/api/admin/earnings/');
    const camel = camelKeys(raw) as Record<string, unknown>;

    return {
      stats: camel.stats as unknown as DashboardStats,
      chartData: ((camel.chartData ?? []) as Record<string, unknown>[]).map(mapEarningStats),
      transactions: ((camel.earnings ?? []) as Record<string, unknown>[]).map(mapEarningTransaction),
    };
  },

  async updatePlatformCommission(rate: number): Promise<void> {
    await api.patch('/api/admin/earnings/', { platform_fee_pct: rate });
  },
};
