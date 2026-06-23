// Core TypeScript definitions for the Car Washing Dashboard

export type BookingStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type UserRole = 'customer' | 'provider' | 'admin';
export type UserStatus = 'active' | 'pending' | 'suspended';
export type PayoutStatus = 'Paid' | 'Failed';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface BookingPhoto {
  image: string;
  uploadedAt: string;
}

export interface BookingPaymentCard {
  cardType: string;
  lastFour: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  providerName?: string;
  providerPhone?: string;
  providerAvatar?: string;
  providerRating?: number;
  providerTotalWashes?: number;
  providerDistanceKm?: number;
  serviceName: string;
  serviceCategory: string;
  serviceDescription?: string;
  serviceBasePrice?: number;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  totalAmount: number;
  carType: string;
  dirtLevel: 'Light' | 'Medium' | 'Heavy';
  dirtLevelDescription?: string;
  dirtPrice?: number;
  address: string;
  city?: string;
  coordinates: LatLng;
  providerCoordinates?: LatLng;
  routePath?: LatLng[];
  notes?: string;
  distanceKm?: number;
  scheduleType?: 'now' | 'scheduled';
  servicePrice?: number;
  vehiclePrice?: number;
  distancePrice?: number;
  engineDiscount?: number;
  platformFee?: number;
  tipAmount?: number;
  paymentCard?: BookingPaymentCard;
  isPaid?: boolean;
  photos?: BookingPhoto[];
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
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
  isVerified?: boolean;
  // Provider-specific details
  documents?: {
    driverLicenseUrl?: string;
    backgroundCheckUrl?: string;
    insuranceUrl?: string;
  };
  rating?: number;
  averageRating?: number;
  completedJobs?: number;
  totalWashes?: number;
  totalEarnings?: number;
  providerStatus?: string;
  vehicleDetails?: {
    make: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
  };
  orders?: number;
  totalSpent?: number;
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
  description: string;
  isActive: boolean;
  vehicleType?: number | null;
  engineType?: number | null;
  image?: string | null;
  order?: number;
}

export interface EarningStats {
  month: string;
  earningsTotal: number;
  revenueTotal: number;
}

export interface EarningTransaction {
  id: number;
  provider: string;
  customer: string;
  service: string;
  grossAmount: number;
  commission: number;
  netAmount: number;
  status: string;
  createdAt: string;
}

export interface TopServiceStat {
  name: string;
  bookings: number;
  revenue: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalCommission: number;
  accruedBalance: number;
  platformFeePct: number;
  platformCommissionRate?: number;
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

export interface ProviderDocument {
  id: number;
  docType: string;
  file: string;
  status: 'approved' | 'rejected' | 'pending';
  adminNote: string;
  uploadedAt: string;
  reviewedAt: string | null;
}

export interface DirtLevelFees {
  Light: number;
  Medium: number;
  Heavy: number;
}

// ---------------------------------------------------------------------------
// Dashboard API (GET /api/admin/dashboard/)
// ---------------------------------------------------------------------------
export interface DashboardStatsData {
  totalOrders: number;
  totalProviders: number;
  totalCustomers: number;
  totalRevenue: number;
  totalCommission: number;
}

export interface DashboardTopProviderData {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  totalWashes: number;
}

export interface DashboardTopServiceData {
  id: number;
  name: string;
  bookingCount: number;
}

export interface DashboardRecentActivityData {
  id: number;
  customer: string;
  provider: string | null;
  service: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface DashboardApiData {
  stats: DashboardStatsData;
  revenueChart: unknown[];
  topProviders: DashboardTopProviderData[];
  topServices: DashboardTopServiceData[];
  recentActivity: DashboardRecentActivityData[];
}
