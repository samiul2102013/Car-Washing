import type { Payout, PayoutStatus } from '../../types';
import { api } from '../api';
import { ApiNotSupported, camelKeys, extractList } from '../helpers';
import { mapPayout } from './mapper';

export const payoutService = {
  async getPayouts(filters?: { status?: string }): Promise<Payout[]> {
    const data = await api.get<unknown>('/api/admin/payouts/', {
      status: filters?.status,
    });
    const list = extractList(data);
    return list.map((r) => mapPayout(camelKeys(r) as Record<string, any>));
  },

  async retryPayout(id: string): Promise<void> {
    await api.post(`/api/admin/payouts/${id}/retry/`);
  },

  async releasePayout(
    _providerId: string,
    _amount: number,
    _bankName: string,
    _accountNumber: string
  ): Promise<Payout> {
    throw new ApiNotSupported(
      'Manual payout release is not supported by the backend yet.'
    );
  },

  async updatePayoutStatus(_id: string, _status: PayoutStatus): Promise<Payout> {
    throw new ApiNotSupported(
      'Only retrying failed payouts is supported by the backend.'
    );
  },
};
