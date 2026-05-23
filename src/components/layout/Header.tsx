'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../providers/AuthProvider';
import { cn } from '../../lib/utils';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const mockHeaderNotifications = [
    { id: '1', text: 'New provider signup waiting for review: Michael Scott', time: '1 hr ago' },
    { id: '2', text: 'Active booking B-1001 status changed to WASHING', time: '2 hrs ago' },
    { id: '3', text: 'Weekly revenue milestone achieved: $9,800.00!', time: '1 day ago' },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-3.5 bg-white rounded-xl border-0 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl bg-white border border-border/60 text-dark-200 hover:text-main-font lg:hidden transition-all duration-200 shadow-sm cursor-pointer"
        >
          <Icon icon="solar:hamburger-menu-linear" className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search Task..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-full border-0 bg-white shadow-sm text-main-font placeholder-dark-200 focus:outline-none focus:ring-1 focus:ring-orange-300 transition-all duration-200"
          />
          <Icon
            icon="solar:magnifer-linear"
            className="w-4.5 h-4.5 text-dark-200 absolute left-3.5 top-3"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-full bg-white text-dark-200 hover:text-main-font shadow-sm transition-all duration-200 relative group cursor-pointer"
          >
            <Icon icon="solar:bell-linear" className="w-4.5 h-4.5 text-dark-200" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border border-white rounded-full animate-pulse" />
          </button>

          {showNotifications && (
            <>
              <div
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 mt-3 w-85 z-50 bg-white border border-border/50 rounded-2xl shadow-xl p-4 animate-accordion-down">
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <h4 className="text-xs font-bold text-main-font uppercase tracking-wider">
                    Recent Alerts
                  </h4>
                  <button className="text-[10px] font-bold text-orange-300 hover:text-orange-600 cursor-pointer">
                    Dismiss All
                  </button>
                </div>
                <div className="py-2 divide-y divide-border/30">
                  {mockHeaderNotifications.map((notif) => (
                    <div key={notif.id} className="py-2.5 hover:bg-dark-50 px-1 rounded-lg transition-colors duration-150">
                      <p className="text-xs font-medium text-main-font leading-normal">
                        {notif.text}
                      </p>
                      <span className="text-[9px] font-medium text-dark-200 mt-1 block">
                        {notif.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-3.5 pl-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-border/50 shadow-sm relative group cursor-pointer">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="hidden sm:block text-left leading-none">
              <h3 className="text-xs font-extrabold text-main-font tracking-tight">
                {user.name}
              </h3>
              <span className="text-[9px] font-bold text-dark-200 tracking-wide mt-1 block lowercase">
                {user.email}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
