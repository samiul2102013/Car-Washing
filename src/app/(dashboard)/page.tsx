'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import StatCard from '../../components/dashboard/StatCard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    setLoading(false);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  if (!mounted || loading) {
    return <DashboardLoadingSkeleton />;
  }

  const revenueChartData = [
    { month: 'Jan', revenue: 11000 },
    { month: 'Feb', revenue: 6000 },
    { month: 'Mar', revenue: 13000 },
    { month: 'Apr', revenue: 12000 },
    { month: 'May', revenue: 21000 },
    { month: 'Jun', revenue: 20000 },
    { month: 'Jul', revenue: 27000 },
    { month: 'Aug', revenue: 18000 },
    { month: 'Sep', revenue: 22000 },
  ];

  const topProviders = [
    { name: 'Alex Rivera', rating: 4.6, bookings: 142, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' },
    { name: 'Sarah Chen', rating: 4.6, bookings: 142, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    { name: 'Marc Wilson', rating: 4.6, bookings: 142, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  ];

  const topServices = [
    { name: 'Express Wash', value: 98 },
    { name: 'Standard Wash', value: 85 },
    { name: 'Premium Wash', value: 78 },
    { name: 'VIP Wash', value: 55 },
  ];

  const recentActivities = [
    { id: '#1278', customer: 'Azhar R.', provider: 'Rakib Auto', status: 'En Route', amount: 250 },
    { id: '#1279', customer: 'Fahim M.', provider: 'Sakib Car', status: 'En Route', amount: 180 },
    { id: '#1280', customer: 'Nusrat J.', provider: 'Rakib Auto', status: 'En Route', amount: 320 },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-main-font tracking-tight leading-none">
            Dashboard
          </h1>
          <p className="text-caption1 text-dark-200 font-medium mt-2">
            Real-time insights into orders, users, and revenue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 h-[46px] px-6 bg-dark-50 hover:bg-dark-50/80 border border-border text-subtitle-2 rounded-full text-caption1-bold transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <Icon icon="solar:restart-linear" className="w-4.5 h-4.5 text-dark-300" />
            Refresh
          </button>
          <button className="flex items-center gap-2 h-[46px] px-6 bg-main-font hover:bg-main-font/90 text-white rounded-full text-caption1-bold transition-all duration-200 active:scale-[0.98] shadow-md cursor-pointer">
            <Icon icon="solar:file-download-linear" className="w-4.5 h-4.5 text-white" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Order"
          value="1,250"
          trend="12.5% vs Last Period"
          trendUp
          trendColor="green"
          icon={<Icon icon="solar:bag-bold-duotone" className="w-5 h-5" />}
          iconBg="bg-orange-50"
          iconColor="#FF9854"
        />
        <StatCard
          label="Providers"
          value="85"
          trend="+5 new this week"
          trendUp
          trendColor="green"
          icon={<Icon icon="solar:user-bold-duotone" className="w-5 h-5" />}
          iconBg="bg-blue-50"
          iconColor="#2E90FA"
        />
        <StatCard
          label="Customers"
          value="540"
          trend="+38 this week"
          trendUp
          trendColor="green"
          icon={<Icon icon="solar:users-group-two-rounded-bold-duotone" className="w-5 h-5" />}
          iconBg="bg-green-50"
          iconColor="#15B79E"
        />
        <StatCard
          label="Total Revenue"
          value="€ 12,250"
          trend="12.5% vs Last Period"
          trendUp={false}
          trendColor="red"
          icon={<Icon icon="solar:wad-of-money-bold-duotone" className="w-5 h-5" />}
          iconBg="bg-green-50"
          iconColor="#15B79E"
        />
        <StatCard
          label="Commission"
          value="€ 2,250"
          trend="12.5% vs Last Period"
          trendUp
          trendColor="green"
          icon={<Icon icon="solar:card-transfer-bold-duotone" className="w-5 h-5" />}
          iconBg="bg-orange-50"
          iconColor="#FF9854"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 bg-white border border-border/50 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-main-font tracking-tight">
                Revenue Over Time
              </h3>
              <div className="relative">
                <select className="appearance-none bg-dark-50 border border-dark-100 rounded-xl px-4 py-1.5 pr-8 text-[10px] font-bold text-dark-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-dark-100">
                  <option>Month</option>
                </select>
                <Icon icon="solar:alt-arrow-down-linear" className="w-3 h-3 text-dark-200 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="h-66 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF9854" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#FF9854" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#E9E9E9" strokeDasharray="3 3" opacity={0.6} />
                  <XAxis
                    dataKey="month"
                    stroke="#989898"
                    fontSize={10}
                    fontWeight="bold"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#989898"
                    fontSize={10}
                    fontWeight="bold"
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 30000]}
                    ticks={[0, 10000, 20000, 30000]}
                    tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '11px',
                      color: '#fff',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                    }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ fontWeight: 'bold', color: '#FF9854', marginBottom: '4px' }}
                    formatter={(value) => [`€ ${Number(value || 0).toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FF9854"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    dot={false}
                    activeDot={{ r: 6, stroke: '#FF9854', strokeWidth: 2, fill: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white border border-border/50 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-main-font tracking-tight">
                Top Providers
              </h3>
              <span className="text-[10px] font-bold text-dark-200 uppercase tracking-wider">
                This month
              </span>
            </div>

            <div className="space-y-4">
              {topProviders.map((provider, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-dark-50/50 rounded-2xl transition-colors duration-150 cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-border/50 shadow-sm relative">
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-main-font leading-none mb-1.5">
                        {provider.name}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <Icon icon="solar:star-bold" className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-[10px] font-bold text-dark-200 font-mono">
                          {provider.rating}
                        </span>
                        <span className="text-[9px] text-dark-200 font-bold uppercase tracking-wider ml-1">
                          &bull; {provider.bookings} bookings
                        </span>
                      </div>
                    </div>
                  </div>
                  <Icon
                    icon="solar:alt-arrow-right-linear"
                    className="w-4 h-4 text-dark-200 group-hover:text-main-font transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 bg-white border border-border/50 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-main-font tracking-tight">
                Recent Activity
              </h3>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-2">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-2">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell className="pl-2 font-bold">{activity.id}</TableCell>
                    <TableCell className="font-medium">{activity.customer}</TableCell>
                    <TableCell className="font-medium">{activity.provider}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-300 border border-orange-100/20">
                        {activity.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-2 font-bold">
                      € {activity.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white border border-border/50 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-main-font tracking-tight">
                Top Services
              </h3>
              <span className="text-[9px] font-bold text-dark-200 uppercase tracking-wider">
                Most booked categories
              </span>
            </div>

            <div className="relative space-y-4 pb-2">
              <div className="absolute inset-y-0 left-24 right-0 pointer-events-none flex justify-between">
                <div className="h-full border-l border-border/50 border-dashed" />
                <div className="h-full border-l border-border/50 border-dashed" />
                <div className="h-full border-l border-border/50 border-dashed" />
                <div className="h-full border-l border-border/50 border-dashed" />
                <div className="h-full border-l border-border/50 border-dashed" />
              </div>

              {topServices.map((service, index) => {
                const percentage = (service.value / 120) * 100;

                return (
                  <div key={index} className="flex items-center gap-3 relative z-10">
                    <span className="text-[9px] font-bold text-dark-200 uppercase tracking-wider w-24 shrink-0 truncate">
                      {service.name}
                    </span>

                    <div className="flex-1 h-6 bg-dark-50/50 rounded-full overflow-hidden border border-border/30">
                      <div
                        className="h-full bg-orange-300 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[9px] font-bold text-dark-200 pl-24 mt-5 pt-3 border-t border-border/30 uppercase tracking-widest font-mono">
              <span>0</span>
              <span>30</span>
              <span>60</span>
              <span>90</span>
              <span>120</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-[1600px] mx-auto p-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-dark-50 rounded-lg" />
          <div className="h-3 w-64 bg-dark-50 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-dark-50 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-34 bg-dark-50 rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 bg-dark-50 rounded-3xl lg:col-span-2" />
        <div className="h-80 bg-dark-50 rounded-3xl" />
      </div>
    </div>
  );
}
