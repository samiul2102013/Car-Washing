'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useAuth } from '../../providers/AuthProvider';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: 'solar:widget-3-linear' },
    { name: 'Bookings', path: '/bookings', icon: 'streamline-ultimate:book-cog-2' },
    { name: 'Users', path: '/users', icon: 'ci:users-group' },
    { name: 'Earnings', path: '/earnings', icon: 'solar:dollar-linear' },
    { name: 'Payouts', path: '/payouts', icon: 'solar:wad-of-money-linear' },
    { name: 'Services', path: '/services', icon: 'mingcute:heartbeat-line' },
    { name: 'Notifications', path: '/notifications', icon: 'solar:bell-linear' },
    { name: 'Settings', path: '/settings', icon: 'material-symbols:settings-outline-rounded' },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col h-[calc(100vh-2rem)] my-4 ml-4 bg-white rounded-3xl shadow-md transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
        expanded ? 'w-64' : 'w-64 lg:w-20',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center px-5 py-6 mb-2 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-3.5 group/logo cursor-pointer w-full bg-transparent border-0 text-left"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8A48] to-[#FF4D4D] relative shrink-0 shadow-sm transition-transform group-hover/logo:scale-105">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.5"/>
                <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 16C12.7355 16 13.3333 15.4022 13.3333 14.6667C13.3333 13.9311 12 12 12 12C12 12 10.6667 13.9311 10.6667 14.6667C10.6667 15.4022 11.2645 16 12 16Z" fill="white"/>
              </svg>
            </div>
            <span className={cn(
              'font-sans tracking-tight whitespace-nowrap transition-opacity duration-200 ease-in-out flex items-center gap-0',
              expanded ? 'opacity-100' : 'lg:opacity-0'
            )}>
              <span className="font-extrabold text-main-font text-base">RIN</span>
              <span className="font-extrabold text-orange-300 text-base">CE</span>
            </span>
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200 relative group',
                  isActive
                    ? 'bg-main-font text-white shadow-md'
                    : 'text-dark-200 hover:text-main-font hover:bg-dark-50'
                )}
              >
                <Icon
                  icon={item.icon}
                  className={cn(
                    'w-5.5 h-5.5 transition-transform duration-200 group-hover:scale-105 shrink-0',
                    isActive ? 'text-white' : 'text-dark-200 group-hover:text-dark-300'
                  )}
                />
                <span className={cn(
                  'whitespace-nowrap transition-opacity duration-200 ease-in-out',
                  expanded ? 'opacity-100' : 'lg:opacity-0'
                )}>
                  {item.name}
                </span>

                <div className={cn(
                  'absolute left-16 px-2.5 py-1.5 rounded-lg bg-main-font text-white text-[10px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-md whitespace-nowrap z-50',
                  expanded ? 'hidden' : 'lg:block hidden'
                )}>
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 shrink-0">
          <button
            onClick={logout}
            className="flex items-center justify-center lg:justify-start w-full p-3 rounded-2xl text-xs font-bold text-red-500 bg-red-50/70 hover:bg-red-100/80 transition-all duration-200 group overflow-hidden border border-red-100/50"
          >
            <span className="flex items-center gap-4 shrink-0">
              <Icon
                icon="solar:logout-3-linear"
                className="w-5.5 h-5.5 text-red-500 group-hover:scale-105 transition-transform shrink-0"
              />
              <span className={cn(
                'whitespace-nowrap transition-opacity duration-200 ease-in-out',
                expanded ? 'opacity-100' : 'lg:opacity-0'
              )}>
                Logout
              </span>
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
