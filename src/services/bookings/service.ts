import type { Booking } from '../../types';
import { api } from '../api';
import { camelKeys, extractList } from '../helpers';
import { mapBooking } from './mapper';

export const bookingService = {
  async getBooks(filters?: { status?: string; search?: string }): Promise<Booking[]> {
    const data = await api.get<unknown>('/api/admin/bookings/', {
      status: filters?.status,
      search: filters?.search,
    });
    const list = extractList(data);
    return list.map((r) => mapBooking(camelKeys(r) as Record<string, any>));
  },

  async getBookings(filters?: { status?: string; search?: string }): Promise<Booking[]> {
    return this.getBooks(filters);
  },

  async getBookingById(id: string): Promise<Booking | undefined> {
    const res = await api.get<Record<string, any>>(`/api/admin/bookings/${id}/`);
    const data = res?.data ?? res;
    return mapBooking(camelKeys(data) as Record<string, any>);
  },
};
