import type { User, UserRole, UserStatus } from '../../types';

function normalizeUserRole(raw: unknown): UserRole {
  const s = String(raw ?? '').toLowerCase();
  if (s === 'provider' || s === 'customer' || s === 'admin') return s;
  if (s === 'washer' || s === 'driver') return 'provider';
  return 'customer';
}

function normalizeUserStatus(raw: unknown): UserStatus {
  const s = String(raw ?? '').toLowerCase();
  if (s === 'blocked' || s === 'banned' || s === 'suspended') return 'suspended';
  if (s === 'pending' || s === 'inactive' || s === 'unverified') return 'pending';
  return 'active';
}

type AnyRec = Record<string, any>;

export function mapUser(raw: AnyRec): User {
  return {
    id: String(raw.id ?? ''),
    name: raw.fullName || raw.name || raw.email?.split('@')[0] || 'Unknown',
    email: raw.email || '',
    role: normalizeUserRole(raw.role),
    status: raw.isActive === false ? 'suspended' : normalizeUserStatus(raw.status ?? 'active'),
    phone: raw.phone || raw.phoneNumber || '',
    avatarUrl: raw.avatarUrl || raw.avatar || raw.image || undefined,
    createdAt: raw.createdAt || raw.joinedAt || raw.dateJoined || new Date().toISOString(),
    isVerified: raw.isVerified ?? undefined,
    documents: raw.documents
      ? {
          driverLicenseUrl: raw.documents.driverLicenseUrl || raw.documents.driverLicense,
          backgroundCheckUrl: raw.documents.backgroundCheckUrl || raw.documents.backgroundCheck,
          insuranceUrl: raw.documents.insuranceUrl || raw.documents.insurance,
        }
      : undefined,
    rating: raw.averageRating ?? raw.rating,
    averageRating: raw.averageRating ?? raw.rating,
    completedJobs: raw.totalWashes ?? raw.completedJobs ?? raw.jobsCompleted,
    totalWashes: raw.totalWashes ?? undefined,
    totalEarnings: raw.totalEarnings ?? undefined,
    providerStatus: raw.providerStatus ?? undefined,
    vehicleDetails: raw.vehicleDetails,
    orders: raw.totalWashes ?? raw.orders ?? raw.totalOrders,
    totalSpent: raw.totalEarnings ?? raw.totalSpent ?? raw.spent,
  };
}
