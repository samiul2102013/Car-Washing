import type { SystemNotification } from '../../types';
import { api } from '../api';
import { MOCK_NOTIFICATIONS } from '../../constants/mockData';

const isClient = typeof window !== 'undefined';

const KEYS = {
  NOTIFICATIONS: 'carwash_notifications',
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

export const notificationService = {
  async broadcastNotification(
    title: string,
    body: string,
    targetRole: SystemNotification['targetRole']
  ): Promise<SystemNotification> {
    await api.post('/api/admin/notifications/send/', {
      target: targetRole,
      title,
      body,
    });
    return {
      id: `n-${Date.now()}`,
      title,
      body,
      targetRole,
      sentAt: new Date().toISOString(),
      status: 'Sent',
      recipientsCount: 0,
    };
  },

  async getNotifications(): Promise<SystemNotification[]> {
    return getOrSet(KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
  },
};
