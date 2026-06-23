import type { Booking, BookingStatus } from '../../types';

function normalizeBookingStatus(raw: unknown): BookingStatus {
  const s = String(raw ?? '').toLowerCase();
  if (s === 'pending' || s === 'active' || s === 'completed' || s === 'cancelled' || s === 'canceled') {
    return s === 'canceled' ? 'cancelled' : s;
  }
  if (s === 'confirmed' || s === 'accepted' || s === 'ongoing') return 'active';
  return 'pending';
}

function normalizeDirtLevel(raw: unknown): 'Light' | 'Medium' | 'Heavy' {
  const s = String(raw ?? '').toLowerCase();
  if (s === 'medium') return 'Medium';
  if (s === 'heavy') return 'Heavy';
  return 'Light';
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

type AnyRec = Record<string, any>;

export function mapBooking(raw: AnyRec): Booking {
  const customer = raw.customer || {};
  const provider = raw.provider || {};
  const service = raw.service || {};
  const dirt = raw.dirtLevel || {};
  const vehicleInfo = raw.vehicle || {};
  const card = raw.paymentCard || {};

  const lat = raw.serviceLatitude ?? raw.coordinates?.lat ?? raw.location?.lat ?? 0;
  const lng = raw.serviceLongitude ?? raw.coordinates?.lng ?? raw.location?.lng ?? 0;
  const provLat = raw.providerCoordinates?.lat ?? raw.providerLocation?.lat;
  const provLng = raw.providerCoordinates?.lng ?? raw.providerLocation?.lng;

  const scheduledAt = raw.scheduledAt ? new Date(raw.scheduledAt) : null;
  const createdAt_ = raw.createdAt || raw.created || '';
  const createdDate = createdAt_ ? new Date(createdAt_) : null;
  const displayDate = scheduledAt || createdDate;

  const hasLocation = lat !== 0 || lng !== 0;

  return {
    id: String(raw.id ?? ''),
    customerName: customer.fullName ?? raw.customerName ?? '—',
    customerPhone: customer.phone ?? raw.customerPhone ?? '',
    customerAvatar: customer.avatar ?? undefined,
    providerName: raw.providerName ?? provider.fullName,
    providerPhone: raw.providerPhone ?? provider.phone ?? '',
    providerAvatar: provider.avatar ?? raw.providerAvatar ?? undefined,
    providerRating: provider.averageRating ?? raw.providerRating,
    providerTotalWashes: provider.totalWashes ?? undefined,
    providerDistanceKm: raw.providerDistanceKm ?? undefined,
    serviceName: raw.serviceName ?? service.name ?? '',
    serviceCategory: raw.serviceCategory ?? service.category ?? '',
    serviceDescription: service.description ?? undefined,
    serviceBasePrice: service.basePrice ? Number(service.basePrice) : undefined,
    date: displayDate ? formatDisplayDate(displayDate) : '',
    timeSlot: scheduledAt
      ? scheduledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      : '',
    status: normalizeBookingStatus(raw.status),
    totalAmount: Number(raw.totalAmount ?? raw.amount ?? raw.price ?? 0),
    carType: vehicleInfo.type ?? raw.carType ?? raw.vehicleType ?? '',
    dirtLevel: normalizeDirtLevel(dirt.level ?? raw.dirtLevel),
    dirtLevelDescription: dirt.description ?? undefined,
    dirtPrice: dirt.extraPrice ? Number(dirt.extraPrice) : undefined,
    address: raw.serviceAddress ?? raw.address ?? raw.location?.address ?? '',
    city: raw.serviceCity ?? undefined,
    coordinates: hasLocation
      ? { lat: Number(lat), lng: Number(lng) }
      : { lat: 0, lng: 0 },
    providerCoordinates: provLat != null && provLng != null
      ? { lat: Number(provLat), lng: Number(provLng) }
      : undefined,
    routePath: Array.isArray(raw.routePath) ? raw.routePath : undefined,
    notes: raw.notes ?? raw.note,
    distanceKm: raw.distanceKm ? Number(raw.distanceKm) : undefined,
    scheduleType: raw.scheduleType ?? undefined,
    servicePrice: raw.servicePrice ? Number(raw.servicePrice) : undefined,
    vehiclePrice: raw.vehiclePrice ? Number(raw.vehiclePrice) : undefined,
    distancePrice: raw.distancePrice ? Number(raw.distancePrice) : undefined,
    engineDiscount: raw.engineDiscount ? Number(raw.engineDiscount) : undefined,
    platformFee: raw.platformFee ? Number(raw.platformFee) : undefined,
    tipAmount: raw.tipAmount ? Number(raw.tipAmount) : undefined,
    paymentCard: raw.paymentCard
      ? {
          cardType: card.cardType ?? '',
          lastFour: card.lastFour ?? '',
          cardholderName: card.cardholderName ?? '',
          expiryMonth: card.expiryMonth ?? 0,
          expiryYear: card.expiryYear ?? 0,
        }
      : undefined,
    isPaid: raw.isPaid ?? undefined,
    photos: Array.isArray(raw.photos)
      ? raw.photos.map((p: AnyRec) => ({ image: p.image ?? '', uploadedAt: p.uploadedAt ?? '' }))
      : undefined,
    createdAt: createdAt_ || new Date().toISOString(),
    acceptedAt: raw.acceptedAt ?? undefined,
    startedAt: raw.startedAt ?? undefined,
    completedAt: raw.completedAt ?? undefined,
  };
}
