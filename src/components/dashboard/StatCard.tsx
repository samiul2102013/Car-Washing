'use client';

import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp?: boolean;
  trendColor?: 'green' | 'red';
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({
  label,
  value,
  trend,
  trendUp = true,
  trendColor = 'green',
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="bg-white border border-border/50 p-5 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-34 group cursor-pointer">
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-bold text-dark-300 uppercase tracking-wider">
          {label}
        </span>
        <div
          className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform',
            iconBg
          )}
          style={{ color: iconColor }}
        >
          {icon}
        </div>
      </div>
      <div>
        <span className="text-2xl font-bold text-main-font block tracking-tight">
          {value}
        </span>
        <div className={cn(
          'flex items-center gap-1 mt-1.5 text-[10px] font-bold',
          trendColor === 'green' ? 'text-green-500' : 'text-red-500'
        )}>
          <svg className={cn('w-3.5 h-3.5', trendUp && 'rotate-180')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
          <span>{trend}</span>
        </div>
      </div>
    </div>
  );
}
