// Core TypeScript definitions for the Car Washing Dashboard

export type BookingStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type UserRole = 'customer' | 'provider' | 'admin';
export type UserStatus = 'active' | 'pending' | 'suspended';
export type PayoutStatus = 'Paid' | 'Failed';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  providerName?: string;
  providerPhone?: string;
  serviceName: string;
  serviceCategory: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  totalAmount: number;
  carType: string;
  dirtLevel: 'Light' | 'Medium' | 'Heavy';
  address: string;
  coordinates: LatLng;
  providerCoordinates?: LatLng; // coordinates of the provider heading to the client
  routePath?: LatLng[]; // path showing the route from provider to client
  notes?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
  // Provider-specific details
  documents?: {
    driverLicenseUrl?: string;
    backgroundCheckUrl?: string;
    insuranceUrl?: string;
  };
  rating?: number;
  completedJobs?: number;
  vehicleDetails?: {
    make: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
  };
}

export interface Payout {
  id: string;
  providerId: string;
  providerName: string;
  amount: number;
  date: string;
  status: PayoutStatus;
  bankName: string;
  accountNumber: string;
  transactionHash: string;
  notes?: string;
}

export interface CarType {
  id: string;
  name: string;
  multiplier: number;
  isActive: boolean;
  image?: string;
}

export interface Service {
  id: string;
  name: string;
  basePrice: number;
  durationMinutes: number;
  description: string;
  category: 'exterior' | 'interior' | 'full-service' | 'detailing';
  isActive: boolean;
}

export interface EarningStats {
  revenue: number;
  earnings: number; // platform portion
  month: string;
}

export interface TopServiceStat {
  name: string;
  bookings: number;
  revenue: number;
}

export interface DashboardStats {
  totalBookings: number;
  activeProviders: number;
  weeklyRevenue: number;
  platformCommissionRate: number; // e.g. 15 for 15%
  totalPayoutsPaid: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  body: string;
  targetRole: 'all' | 'customers' | 'providers';
  sentAt: string;
  status: 'Sent' | 'Failed';
  recipientsCount: number;
}

export interface DirtLevelFees {
  Light: number;
  Medium: number;
  Heavy: number;
}
