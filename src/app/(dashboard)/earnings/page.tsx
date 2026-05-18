'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { earningService } from '../../../services';
import { DashboardStats, EarningStats } from '../../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';

export default function EarningsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [earningsData, setEarningsData] = useState<EarningStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadFinancials = async () => {
    try {
      const [dashboardStats, monthlyEarnings] = await Promise.all([
        earningService.getDashboardStats(),
        earningService.getMonthlyEarnings(),
      ]);

      setStats(dashboardStats);
      setEarningsData(monthlyEarnings);
    } catch (err) {
      console.error('Failed to load financial stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      loadFinancials();
    }
  }, [mounted]);

  if (!mounted || loading) {
    return <EarningsLoadingSkeleton />;
  }

  // Exact timeline matching the Figma screenshot (Jan, Feb, Mar, Apr, May, Jun, Jul, Text, Text)
  const figmaChartData = [
    { name: 'Jan', earnings: 12000, revenue: 11000 },
    { name: 'Feb', earnings: 6500, revenue: 5500 },
    { name: 'Mar', earnings: 9000, revenue: 8000 },
    { name: 'Apr', earnings: 16000, revenue: 15000 },
    { name: 'May', earnings: 26500, revenue: 25000 },
    { name: 'Jun', earnings: 32000, revenue: 29500 },
    { name: 'Jul', earnings: 23000, revenue: 20500 },
    { name: 'Text', earnings: 26000, revenue: 23000 },
    { name: 'Text', earnings: 27500, revenue: 24000 }
  ];

  // High-fidelity transaction data matching the table screenshot
  const mockTransactions = [
    {
      customerName: 'Marc Wilson',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      providerName: 'Jack',
      providerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      serviceName: 'Express Wash',
      amount: 250,
      commission: 25,
      status: 'Paid'
    },
    {
      customerName: 'Marc Wilson',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      providerName: 'Jack',
      providerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      serviceName: 'Express Wash',
      amount: 250,
      commission: 25,
      status: 'Failed'
    },
    {
      customerName: 'Marc Wilson',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      providerName: 'Jack',
      providerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      serviceName: 'Express Wash',
      amount: 250,
      commission: 25,
      status: 'Paid'
    },
    {
      customerName: 'Marc Wilson',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      providerName: 'Jack',
      providerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      serviceName: 'Express Wash',
      amount: 250,
      commission: 25,
      status: 'Failed'
    }
  ];

  return (
    <div className="space-y-5 w-full pb-8 animate-fade-in font-sans">
      
      {/* 1. Header Row (Figma Style: text-[40px] title, text-[28px] subtitle) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-main-font tracking-tight leading-none">
            Earnings Dashboard
          </h1>
          <p className="text-body2 text-dark-200 font-semibold mt-3.5 leading-none">
            Track your platform revenue and car wash commissions.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadFinancials}
            className="flex items-center gap-2 h-[46px] px-6 bg-dark-50 hover:bg-dark-50/80 border border-border text-subtitle-2 rounded-full text-caption1-bold transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <Icon icon="solar:restart-linear" className="w-4.5 h-4.5 text-dark-300" />
            Refresh
          </button>
          
          <button
            className="flex items-center gap-2 h-[46px] px-6 bg-main-font hover:bg-main-font/90 text-white rounded-full text-caption1-bold transition-all duration-200 active:scale-[0.98] shadow-md shadow-main-font/10 cursor-pointer"
          >
            <Icon icon="solar:file-download-linear" className="w-4.5 h-4.5 text-white" />
            Export
          </button>
        </div>
      </div>

      {/* 2. Main Workspace Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Card: Revenue Over Time Line Graph (Figma: h-[532px], rounded-[12px]) */}
        <div className="bg-white border border-border/60 p-6 rounded-xl shadow-sm lg:col-span-2 h-[532px] flex flex-col justify-between">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-h5-bold text-main-font tracking-tight">
              Revenue Over Time
            </h3>
            
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 select-none">
                <span className="w-3.5 h-3.5 rounded-full bg-[#52FA7C] shadow-sm shadow-[#52FA7C]/30 shrink-0" />
                <span className="text-caption1-bold text-dark-200">Earnings</span>
              </div>
              <div className="flex items-center gap-2 select-none">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF8A48] shadow-sm shadow-[#FF8A48]/30 shrink-0" />
                <span className="text-caption1-bold text-dark-200">Revenue</span>
              </div>
              
              <div className="bg-dark-50 border border-border rounded-xl px-3 py-1.5 text-caption1-bold text-dark-300 flex items-center gap-1.5 cursor-pointer shadow-sm select-none">
                <span>Month</span>
                <Icon icon="solar:alt-arrow-down-linear" className="w-3.5 h-3.5 text-dark-300" />
              </div>
            </div>
          </div>

          {/* Dual curve Line graph (Height optimized for h-[532px] container) */}
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={figmaChartData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={11.5} 
                  tickLine={false} 
                  axisLine={false} 
                  className="font-bold text-dark-200"
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11.5} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val === 0 ? '0' : `${val / 1000}K`}
                  className="font-bold text-dark-200"
                />
                <Tooltip
                  cursor={{ stroke: '#FF8A48', strokeWidth: 1 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#121315] text-white px-3.5 py-2.5 rounded-xl shadow-lg border border-border text-caption1-bold space-y-1 animate-scale-up">
                          <p className="text-dark-200 font-semibold">{label}</p>
                          <p className="text-[#52FA7C] font-black">Earnings: €{payload[0].value?.toLocaleString()}</p>
                          <p className="text-orange-300 font-black">Revenue: €{payload[1].value?.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Neon Green Earnings Curve */}
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#52FA7C" 
                  strokeWidth={2}
                  dot={{ r: 3, stroke: '#52FA7C', strokeWidth: 1.5, fill: '#fff' }}
                  activeDot={{ r: 5 }}
                />
                {/* Orange Revenue Curve */}
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#FF8A48" 
                  strokeWidth={2}
                  dot={{ r: 3, stroke: '#FF8A48', strokeWidth: 1.5, fill: '#fff' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right stacked cards (Figma: h-[256px] each, rounded-[12px]) */}
        <div className="flex flex-col gap-5 h-[532px]">
          
          {/* Card A: Dark Auto-Payout Active card */}
          <div className="bg-main-font text-white rounded-xl p-6.5 flex flex-col justify-between h-[256px] shadow-lg shadow-main-font/10 relative overflow-hidden group border border-main-font/20 shrink-0">
            <span className="text-body1-bold text-white/95 block select-none">
              Auto-Payout Active
            </span>
            <div>
              <span className="text-[46px] font-black tracking-tight leading-none block">
                <span className="text-orange-300 font-extrabold mr-2">€</span>
                12,500.00
              </span>
            </div>
            <p className="text-caption1 text-white/40 font-semibold leading-normal select-none">
              Accrued balance awaiting batch processing
            </p>
          </div>

          <div className="bg-white border border-border/60 rounded-xl p-6.5 flex flex-col justify-between h-[256px] shadow-sm shrink-0">
            <span className="text-body1-bold text-main-font block select-none leading-none">
              Commission Rules
            </span>
            <div className="flex items-center justify-between mt-auto pb-4">
              <span className="text-body2-bold text-dark-300 select-none">
                Platform Fee
              </span>
              <div className="bg-dark-50 text-main-font text-body2-bold font-black py-2.5 px-6 rounded-lg border border-border/50 shadow-sm select-none">
                {stats?.platformCommissionRate ? `${stats.platformCommissionRate.toFixed(1)}%` : '20.0%'}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white border border-border/60 rounded-xl shadow-sm overflow-hidden p-2">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-dark-50/90">
              <TableHead className="rounded-l-xl">Customer</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead className="rounded-r-xl">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((tx, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-border shadow-sm shrink-0">
                      <img 
                        src={tx.customerAvatar} 
                        alt={tx.customerName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-caption1-bold text-main-font">
                      {tx.customerName}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-border shadow-sm shrink-0">
                      <img 
                        src={tx.providerAvatar} 
                        alt={tx.providerName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-caption1-bold text-main-font">
                      {tx.providerName}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-dark-300">
                  {tx.serviceName}
                </TableCell>

                <TableCell>
                  <span className="text-orange-300 font-bold mr-0.5">€</span>
                  <span className="text-main-font font-extrabold">{tx.amount}</span>
                </TableCell>

                <TableCell>
                  <span className="text-orange-300 font-bold mr-0.5">€</span>
                  <span className="text-main-font font-extrabold">{tx.commission}</span>
                </TableCell>

                <TableCell>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-caption1-bold border
                    ${tx.status === 'Paid' 
                      ? 'bg-emerald-50 text-emerald-500 border-emerald-100/30' 
                      : 'bg-rose-50 text-rose-500 border-rose-100/30'
                    }
                  `}>
                    {tx.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}

function EarningsLoadingSkeleton() {
  return (
    <div className="space-y-5 animate-pulse w-full pb-8">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-dark-50 rounded-lg"></div>
        <div className="h-3 w-64 bg-dark-50 rounded-lg"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="h-[532px] bg-dark-50 rounded-xl lg:col-span-2"></div>
        <div className="h-[532px] bg-dark-50 rounded-xl"></div>
      </div>
    </div>
  );
}
