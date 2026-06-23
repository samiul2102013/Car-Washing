import type { Payout, PayoutStatus } from '../../types';

function normalizePayoutStatus(raw: unknown): PayoutStatus {
  const s = String(raw ?? '').toLowerCase();
  if (s === 'failed' || s === 'rejected' || s === 'error') return 'Failed';
  return 'Paid';
}

type AnyRec = Record<string, any>;

export function mapPayout(raw: AnyRec): Payout {
  return {
    id: String(raw.id ?? ''),
    providerId: String(raw.providerId ?? raw.provider?.id ?? ''),
    providerName: raw.providerName || raw.provider?.name || '',
    amount: Number(raw.amount ?? raw.netPaid ?? raw.netAmount ?? raw.grossAmount ?? 0),
    date: raw.date || raw.createdAt || raw.paidAt || '',
    status: normalizePayoutStatus(raw.status),
    bankName: raw.bankName || raw.bank || raw.method || '',
    accountNumber: raw.accountNumber || raw.account || '',
    transactionHash: raw.transactionHash || raw.txHash || raw.reference || raw.id || '',
    notes: raw.notes,
  };
}
