// Unified Service layer with simulated delay and local storage persistence

import { 
  MOCK_BOOKINGS, 
  MOCK_USERS, 
  MOCK_PAYOUTS, 
  MOCK_CAR_TYPES, 
  MOCK_SERVICES, 
  MOCK_DASHBOARD_STATS, 
  MOCK_EARNINGS_STATS, 
  MOCK_TOP_SERVICES, 
  MOCK_NOTIFICATIONS 
} from '../constants/mockData';
import { Booking, User, Payout, PayoutStatus, CarType, Service, DashboardStats, EarningStats, TopServiceStat, SystemNotification, BookingStatus, UserStatus, DirtLevelFees } from '../types';

// Helper to check for client side
const isClient = typeof window !== 'undefined';

// Local storage keys
const KEYS = {
  BOOKINGS: 'carwash_bookings',
  USERS: 'carwash_users',
  PAYOUTS: 'carwash_payouts',
  CAR_TYPES: 'carwash_cartypes',
  SERVICES: 'carwash_services',
  STATS: 'carwash_stats',
  NOTIFICATIONS: 'carwash_notifications',
  DIRT_FEES: 'carwash_dirt_fees'
};

// Database state initializer
const initDB = () => {
  if (!isClient) return {
    bookings: MOCK_BOOKINGS,
    users: MOCK_USERS,
    payouts: MOCK_PAYOUTS,
    carTypes: MOCK_CAR_TYPES,
    services: MOCK_SERVICES,
    stats: MOCK_DASHBOARD_STATS,
    notifications: MOCK_NOTIFICATIONS,
    dirtFees: { Light: 0, Medium: 10, Heavy: 25 }
  };

  const getOrSet = (key: string, defaultVal: any) => {
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

  return {
    bookings: getOrSet(KEYS.BOOKINGS, MOCK_BOOKINGS),
    users: getOrSet(KEYS.USERS, MOCK_USERS),
    payouts: getOrSet(KEYS.PAYOUTS, MOCK_PAYOUTS),
    carTypes: getOrSet(KEYS.CAR_TYPES, MOCK_CAR_TYPES),
    services: getOrSet(KEYS.SERVICES, MOCK_SERVICES),
    stats: getOrSet(KEYS.STATS, MOCK_DASHBOARD_STATS),
    notifications: getOrSet(KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS),
    dirtFees: getOrSet(KEYS.DIRT_FEES, { Light: 0, Medium: 10, Heavy: 25 })
  };
};

// Database persistence helper
const saveDB = (key: string, data: any) => {
  if (isClient) {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Delay helper
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// 1. BOOKINGS SERVICE
// ==========================================
export const bookingService = {
  async getBookings(): Promise<Booking[]> {
    await delay();
    const db = initDB();
    return db.bookings;
  },

  async getBookingById(id: string): Promise<Booking | undefined> {
    await delay();
    const db = initDB();
    return db.bookings.find((b: Booking) => b.id === id);
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    await delay();
    const db = initDB();
    const index = db.bookings.findIndex((b: Booking) => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    db.bookings[index].status = status;
    saveDB(KEYS.BOOKINGS, db.bookings);

    // Sync stats if completed
    if (status === 'completed') {
      const stats = db.stats;
      stats.totalBookings += 1;
      stats.weeklyRevenue += db.bookings[index].totalAmount;
      saveDB(KEYS.STATS, stats);
    }

    return db.bookings[index];
  }
};

// ==========================================
// 2. USERS & PROVIDERS SERVICE
// ==========================================
export const userService = {
  async getUsers(): Promise<User[]> {
    await delay();
    const db = initDB();
    return db.users;
  },

  async getUserById(id: string): Promise<User | undefined> {
    await delay();
    const db = initDB();
    return db.users.find((u: User) => u.id === id);
  },

  async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    await delay();
    const db = initDB();
    const index = db.users.findIndex((u: User) => u.id === id);
    if (index === -1) throw new Error('User not found');

    db.users[index].status = status;
    saveDB(KEYS.USERS, db.users);
    return db.users[index];
  },

  async approveProvider(id: string): Promise<User> {
    await delay();
    const db = initDB();
    const index = db.users.findIndex((u: User) => u.id === id);
    if (index === -1) throw new Error('Provider not found');

    db.users[index].status = 'active';
    saveDB(KEYS.USERS, db.users);

    // Sync stats
    const stats = db.stats;
    stats.activeProviders = db.users.filter((u: User) => u.role === 'provider' && u.status === 'active').length;
    saveDB(KEYS.STATS, stats);

    return db.users[index];
  }
};

// ==========================================
// 3. EARNINGS & STATS SERVICE
// ==========================================
export const earningService = {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(300);
    const db = initDB();
    return db.stats;
  },

  async getMonthlyEarnings(): Promise<EarningStats[]> {
    await delay(300);
    return MOCK_EARNINGS_STATS;
  },

  async getTopServices(): Promise<TopServiceStat[]> {
    await delay(300);
    return MOCK_TOP_SERVICES;
  },

  async updatePlatformCommission(rate: number): Promise<DashboardStats> {
    await delay();
    const db = initDB();
    db.stats.platformCommissionRate = rate;
    saveDB(KEYS.STATS, db.stats);
    return db.stats;
  }
};

// ==========================================
// 4. PAYOUTS SERVICE
// ==========================================
export const payoutService = {
  async getPayouts(): Promise<Payout[]> {
    await delay();
    const db = initDB();
    return db.payouts;
  },

  async releasePayout(providerId: string, amount: number, bankName: string, accountNumber: string): Promise<Payout> {
    await delay(600); // slightly longer to simulate transaction processing
    const db = initDB();
    const provider = db.users.find((u: User) => u.id === providerId);
    if (!provider) throw new Error('Provider not found');

    const newPayout: Payout = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      providerId,
      providerName: provider.name,
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      bankName,
      accountNumber: `•••• ${accountNumber.slice(-4)}`,
      transactionHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      notes: 'Weekly manual payout release.'
    };

    db.payouts.unshift(newPayout);
    saveDB(KEYS.PAYOUTS, db.payouts);

    // Sync stats
    const stats = db.stats;
    stats.totalPayoutsPaid += amount;
    saveDB(KEYS.STATS, stats);

    return newPayout;
  },

  async updatePayoutStatus(id: string, status: PayoutStatus): Promise<Payout> {
    await delay();
    const db = initDB();
    const index = db.payouts.findIndex((p: Payout) => p.id === id);
    if (index === -1) throw new Error('Payout not found');

    db.payouts[index].status = status;
    saveDB(KEYS.PAYOUTS, db.payouts);

    // Sync stats if paid
    if (status === 'Paid') {
      const stats = db.stats;
      stats.totalPayoutsPaid += db.payouts[index].amount;
      saveDB(KEYS.STATS, stats);
    }

    return db.payouts[index];
  }
};

// ==========================================
// 5. CAR TYPES SERVICE
// ==========================================
export const carTypeService = {
  async getCarTypes(): Promise<CarType[]> {
    await delay();
    const db = initDB();
    return db.carTypes;
  },

  async addCarType(name: string, multiplier: number): Promise<CarType> {
    await delay();
    const db = initDB();
    const newCarType: CarType = {
      id: `ct-${Date.now()}`,
      name,
      multiplier,
      isActive: true
    };
    db.carTypes.push(newCarType);
    saveDB(KEYS.CAR_TYPES, db.carTypes);
    return newCarType;
  },

  async updateCarType(id: string, multiplier: number, isActive: boolean): Promise<CarType> {
    await delay();
    const db = initDB();
    const index = db.carTypes.findIndex((c: CarType) => c.id === id);
    if (index === -1) throw new Error('Car type not found');

    db.carTypes[index].multiplier = multiplier;
    db.carTypes[index].isActive = isActive;
    saveDB(KEYS.CAR_TYPES, db.carTypes);
    return db.carTypes[index];
  },

  async deleteCarType(id: string): Promise<void> {
    await delay();
    const db = initDB();
    db.carTypes = db.carTypes.filter((c: CarType) => c.id !== id);
    saveDB(KEYS.CAR_TYPES, db.carTypes);
  }
};

// ==========================================
// 6. SERVICES CONFIG SERVICE
// ==========================================
export const serviceConfigService = {
  async getServices(): Promise<Service[]> {
    await delay();
    const db = initDB();
    return db.services;
  },

  async addService(name: string, basePrice: number, durationMinutes: number, description: string, category: Service['category']): Promise<Service> {
    await delay();
    const db = initDB();
    const newService: Service = {
      id: `s-${Date.now()}`,
      name,
      basePrice,
      durationMinutes,
      description,
      category,
      isActive: true
    };
    db.services.push(newService);
    saveDB(KEYS.SERVICES, db.services);
    return newService;
  },

  async updateService(id: string, basePrice: number, durationMinutes: number, description: string, isActive: boolean): Promise<Service> {
    await delay();
    const db = initDB();
    const index = db.services.findIndex((s: Service) => s.id === id);
    if (index === -1) throw new Error('Service not found');

    db.services[index].basePrice = basePrice;
    db.services[index].durationMinutes = durationMinutes;
    db.services[index].description = description;
    db.services[index].isActive = isActive;
    saveDB(KEYS.SERVICES, db.services);
    return db.services[index];
  },

  async deleteService(id: string): Promise<void> {
    await delay();
    const db = initDB();
    db.services = db.services.filter((s: Service) => s.id !== id);
    saveDB(KEYS.SERVICES, db.services);
  },

  async getDirtLevelFees(): Promise<DirtLevelFees> {
    await delay();
    const db = initDB();
    return db.dirtFees;
  },

  async updateDirtLevelFees(fees: DirtLevelFees): Promise<DirtLevelFees> {
    await delay();
    saveDB(KEYS.DIRT_FEES, fees);
    return fees;
  }
};

// ==========================================
// 7. NOTIFICATIONS SERVICE
// ==========================================
export const notificationService = {
  async getNotifications(): Promise<SystemNotification[]> {
    await delay();
    const db = initDB();
    return db.notifications;
  },

  async broadcastNotification(title: string, body: string, targetRole: SystemNotification['targetRole']): Promise<SystemNotification> {
    await delay(500);
    const db = initDB();
    
    // Calculate simulated recipient counts
    let recipientsCount = db.users.length;
    if (targetRole === 'customers') {
      recipientsCount = db.users.filter((u: User) => u.role === 'customer').length;
    } else if (targetRole === 'providers') {
      recipientsCount = db.users.filter((u: User) => u.role === 'provider').length;
    }

    const newNotification: SystemNotification = {
      id: `n-${Date.now()}`,
      title,
      body,
      targetRole,
      sentAt: new Date().toISOString(),
      status: 'Sent',
      recipientsCount
    };

    db.notifications.unshift(newNotification);
    saveDB(KEYS.NOTIFICATIONS, db.notifications);
    return newNotification;
  }
};
