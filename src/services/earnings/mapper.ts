import type { EarningStats, EarningTransaction } from '../../types';

function formatMonth(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short' });
}

type AnyRec = Record<string, any>;

export function mapEarningStats(raw: AnyRec): EarningStats {
  return {
    month: raw.month ? formatMonth(raw.month) : '',
    earningsTotal: Number(raw.earningsTotal ?? raw.earnings_total ?? 0),
    revenueTotal: Number(raw.revenueTotal ?? raw.revenue_total ?? 0),
  };
}

export function mapEarningTransaction(raw: AnyRec): EarningTransaction {
  return {
    id: Number(raw.id ?? 0),
    provider: raw.provider ?? '',
    customer: raw.customer ?? '',
    service: raw.service ?? '',
    grossAmount: Number(raw.grossAmount ?? raw.gross_amount ?? 0),
    commission: Number(raw.commission ?? 0),
    netAmount: Number(raw.netAmount ?? raw.net_amount ?? 0),
    status: raw.status ?? '',
    createdAt: raw.createdAt ?? raw.created_at ?? '',
  };
}
