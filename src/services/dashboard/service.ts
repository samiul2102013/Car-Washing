import type { DashboardApiData } from '../../types';
import { api } from '../api';
import { camelKeys } from '../helpers';

export const dashboardService = {
  async getDashboardData(): Promise<DashboardApiData> {
    const res = await api.get<Record<string, any>>('/api/admin/dashboard/');
    const data = res?.data ?? res;
    return camelKeys<DashboardApiData>(data);
  },
};
