'use client';

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
        'w-64 lg:w-20 lg:hover:w-64 group/sidebar',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center gap-3.5 px-5 py-6 mb-2 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-orange-300 bg-white relative shrink-0">
            <div className="w-5 h-5 rounded-full bg-orange-300 flex items-center justify-center text-[10px] text-white font-black">
              C
            </div>
          </div>
          <div className="flex items-center font-sans tracking-tight opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-200 ease-in-out delay-75 pointer-events-none lg:pointer-events-auto">
            <span className="font-extrabold text-main-font text-base">RIN</span>
            <span className="font-extrabold text-orange-300 text-base">CE</span>
          </div>
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
                <span className="opacity-100 lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-200 ease-in-out delay-75 whitespace-nowrap">
                  {item.name}
                </span>

                <div className="absolute left-16 px-2.5 py-1.5 rounded-lg bg-main-font text-white text-[10px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-md lg:block hidden lg:group-hover/sidebar:hidden whitespace-nowrap z-50">
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
              <span className="opacity-100 lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-200 ease-in-out delay-75 whitespace-nowrap">
                Logout
              </span>
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
