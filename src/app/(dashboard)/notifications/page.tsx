'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { notificationService } from '../../../services';

interface LogNotificationItem {
  id: string;
  title: string;
  body: string;
  audience: 'All' | 'Customer' | 'Provider';
  dateTime: string;
  status: 'Sent' | 'Scheduled';
}

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);

  // Form states
  const [sending, setSending] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<'Send Now' | 'Schedule'>('Send Now');
  const [activeAudience, setActiveAudience] = useState<'All' | 'Customer' | 'Provider'>('All');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Local state for alert dispatch confirmations
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Static high-fidelity notifications mirroring screenshot log
  const initialLogs: LogNotificationItem[] = [
    {
      id: 'notif-1',
      title: 'Standard Wash',
      body: 'Exterior wash + Interior Vacuum',
      audience: 'Customer',
      dateTime: '12/06/2026',
      status: 'Sent',
    },
    {
      id: 'notif-2',
      title: 'Standard Wash',
      body: 'Exterior wash + Interior Vacuum',
      audience: 'Customer',
      dateTime: '12/06/2026',
      status: 'Sent',
    },
    {
      id: 'notif-3',
      title: 'Standard Wash',
      body: 'Exterior wash + Interior Vacuum',
      audience: 'Customer',
      dateTime: '12/06/2026',
      status: 'Sent',
    },
    {
      id: 'notif-4',
      title: 'Standard Wash',
      body: 'Exterior wash + Interior Vacuum',
      audience: 'Customer',
      dateTime: '12/06/2026',
      status: 'Scheduled',
    },
    {
      id: 'notif-5',
      title: 'Standard Wash',
      body: 'Exterior wash + Interior Vacuum',
      audience: 'Customer',
      dateTime: '12/06/2026',
      status: 'Scheduled',
    },
    {
      id: 'notif-6',
      title: 'Standard Wash',
      body: 'Exterior wash + Interior Vacuum',
      audience: 'Customer',
      dateTime: '12/06/2026',
      status: 'Scheduled',
    },
  ];

  const [notificationLogs, setNotificationLogs] = useState<LogNotificationItem[]>(initialLogs);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    try {
      setSending(true);
      const audienceMap = { All: 'all', Customer: 'customers', Provider: 'providers' } as const;
      const created = await notificationService.broadcastNotification(
        title, message, audienceMap[activeAudience]
      );
      setNotificationLogs([{
        id: created.id,
        title,
        body: message,
        audience: activeAudience,
        dateTime: new Date().toLocaleDateString('en-GB'),
        status: 'Sent',
      }, ...notificationLogs]);
      setSuccessBanner(`Notification "${title}" dispatched to ${activeAudience}.`);
      setTitle('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setSuccessBanner(null);
    } finally {
      setSending(false);
    }
    setTimeout(() => {
      setSuccessBanner(null);
    }, 4000);
  };

  if (!mounted) {
    return <NotificationsLoadingSkeleton />;
  }

  return (
    <div className="space-y-8 w-full pb-12 animate-fade-in font-sans">
      
      {/* 1. Header titles */}
      <div>
        <h1 className="text-h3 text-main-font tracking-tight leading-none">
          Notifications
        </h1>
        <p className="text-caption1 text-dark-200 font-semibold mt-3.5 leading-none">
          Send updates and alerts to customers and providers.
        </p>
      </div>

      {/* Dispatch Success Alert Banner */}
      {successBanner && (
        <div className="flex items-center gap-3 p-4 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold animate-slide-down shadow-sm select-none">
          <Icon icon="solar:check-circle-bold" className="w-5 h-5 shrink-0 text-emerald-500 animate-bounce" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* 2. Dual-Column Content Layout matching Screenshot 3 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Card: Create Notifications (xl:col-span-5) */}
        <div className="xl:col-span-5 bg-white border border-border rounded-xl p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-h5-bold text-main-font tracking-tight">
              Create Notifications
            </h3>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-6">
            
            {/* Audience Section */}
            <div className="space-y-3">
              <span className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
                Audience
              </span>

              {/* Delivery mode switch: Send Now vs Schedule */}
              <div className="bg-dark-50/60 rounded-full h-[59px] flex items-center p-1.5 w-full select-none">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('Send Now')}
                  className={`flex-1 h-full flex items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer
                    ${deliveryMode === 'Send Now'
                      ? 'bg-white text-orange-300 shadow-sm font-black'
                      : 'text-dark-300 hover:text-main-font bg-transparent'
                    }
                  `}
                >
                  Send Now
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMode('Schedule')}
                  className={`flex-1 h-full flex items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer
                    ${deliveryMode === 'Schedule'
                      ? 'bg-white text-orange-300 shadow-sm font-black'
                      : 'text-dark-300 hover:text-main-font bg-transparent'
                    }
                  `}
                >
                  Schedule
                </button>
              </div>

              {/* Segmentation selectors side-by-side with cute character cartoons from mockup */}
              <div className="flex gap-4">
                
                {/* 1. All Users Segment Card */}
                <button
                  type="button"
                  onClick={() => setActiveAudience('All')}
                  className={`flex-1 p-3 rounded-xl flex flex-col items-center justify-center gap-2.5 transition-all border cursor-pointer select-none active:scale-[0.97]
                    ${activeAudience === 'All'
                      ? 'bg-orange-50 border-orange-300 text-orange-300 shadow-sm'
                      : 'bg-dark-50 hover:bg-dark-50 border-border/50 text-dark-300'
                    }
                  `}
                >
                  {/* Cartoon illustration SVG for All Users */}
                  <div className="w-12 h-12 flex items-center justify-center relative shrink-0">
                    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                      <circle cx="24" cy="24" r="22" fill="#FFEFE5" />
                      <circle cx="16" cy="18" r="5" fill="#4B90E2" />
                      <path d="M8 36c0-4.4 3.6-8 8-8s8 3.6 8 8v2H8v-2z" fill="#4B90E2" />
                      <circle cx="32" cy="18" r="5" fill="#50B83C" />
                      <path d="M24 36c0-4.4 3.6-8 8-8s8 3.6 8 8v2H24v-2z" fill="#50B83C" />
                      <circle cx="24" cy="20" r="5" fill="#E65100" />
                      <path d="M16 38c0-4.4 3.6-8 8-8s8 3.6 8 8v2H16v-2z" fill="#FF8A48" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight">
                    All Users
                  </span>
                </button>

                {/* 2. Customer Segment Card */}
                <button
                  type="button"
                  onClick={() => setActiveAudience('Customer')}
                  className={`flex-1 p-3 rounded-xl flex flex-col items-center justify-center gap-2.5 transition-all border cursor-pointer select-none active:scale-[0.97]
                    ${activeAudience === 'Customer'
                      ? 'bg-orange-50 border-orange-300 text-orange-300 shadow-sm'
                      : 'bg-dark-50 hover:bg-dark-50 border-border/50 text-dark-300'
                    }
                  `}
                >
                  {/* Cartoon illustration SVG for Customer */}
                  <div className="w-12 h-12 flex items-center justify-center relative shrink-0">
                    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                      <circle cx="24" cy="24" r="22" fill="#E8F5E9" />
                      <circle cx="24" cy="18" r="7" fill="#00796B" />
                      <path d="M24 12c-3.8 0-7 3.2-7 7 0 2.5 1.3 4.7 3.2 5.9C15.8 26.6 12 30.8 12 36v2h24v-2c0-5.2-3.8-9.4-8.2-11.1 1.9-1.2 3.2-3.4 3.2-5.9 0-3.8-3.2-7-7-7z" fill="#009688" />
                      {/* Ribbon / hair cartoon */}
                      <path d="M20 13c0-3 8-3 8 0s-2 5-4 5-4-2-4-5z" fill="#D32F2F" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight">
                    Customer
                  </span>
                </button>

                {/* 3. Provider Segment Card */}
                <button
                  type="button"
                  onClick={() => setActiveAudience('Provider')}
                  className={`flex-1 p-3 rounded-xl flex flex-col items-center justify-center gap-2.5 transition-all border cursor-pointer select-none active:scale-[0.97]
                    ${activeAudience === 'Provider'
                      ? 'bg-orange-50 border-orange-300 text-orange-300 shadow-sm'
                      : 'bg-dark-50 hover:bg-dark-50 border-border/50 text-dark-300'
                    }
                  `}
                >
                  {/* Cartoon illustration SVG for Provider (Worker with hardhat) */}
                  <div className="w-12 h-12 flex items-center justify-center relative shrink-0">
                    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                      <circle cx="24" cy="24" r="22" fill="#EFFFEE" />
                      <circle cx="24" cy="19" r="6" fill="#3E2723" />
                      {/* Worker Yellow Helmet */}
                      <path d="M17 19c0-3.8 3.1-7 7-7s7 3.2 7 7h-14zM24 10v2" stroke="#FBC02D" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M15 19h18v1.5H15V19z" fill="#FBC02D" />
                      {/* Worker Suit */}
                      <path d="M14 36c0-5 4-9 9-9h2c5 0 9 4 9 9v2H14v-2z" fill="#1565C0" />
                      {/* Orange braces */}
                      <path d="M19 27v11M29 27v11" stroke="#FF5722" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight">
                    Provider
                  </span>
                </button>

              </div>
            </div>

            {/* Title field */}
            <div className="space-y-2">
              <label className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short heading"
                className="w-full h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font placeholder-dark-200 focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
                required
              />
            </div>

            {/* Message textbox */}
            <div className="space-y-2">
              <label className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write the main content..."
                className="w-full bg-dark-50/60 rounded-2xl p-6 text-sm font-semibold text-main-font placeholder-dark-200 border-0 focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all resize-none"
                required
              />
            </div>

            {/* Dispatch Send Notifications button */}
            <button
              type="submit"
              disabled={sending}
              className="w-full h-[59px] bg-main-font hover:bg-main-font/90 text-white rounded-full text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Icon icon="solar:cursor-bold" className={`w-4 h-4 text-white ${sending ? '' : 'rotate-45'}`} />
              {sending ? 'Sending...' : 'Send Notifications'}
            </button>

          </form>
        </div>

        {/* Right Column Card: Log History Table (xl:col-span-7) */}
        <div className="xl:col-span-7 bg-white border border-border rounded-xl shadow-sm overflow-hidden p-0 w-full">
          
          {/* Table header block with grey E9EBEF/60 background matching layout */}
          <div className="w-full h-[66px] bg-dark-50 flex items-center px-8 border-b border-border/50">
            <div className="grid grid-cols-12 w-full text-caption1-bold text-dark-300 uppercase tracking-widest items-center">
              <div className="col-span-5">Notifications</div>
              <div className="col-span-2 text-center">Audience</div>
              <div className="col-span-3 text-center">Date & Time</div>
              <div className="col-span-2 text-right pr-2">Status</div>
            </div>
          </div>

          {/* List items with correct spacing */}
          <div className="divide-y divide-border px-6">
            {notificationLogs.map((log) => (
              <div 
                key={log.id}
                className="grid grid-cols-12 w-full py-5 items-center px-2 hover:bg-dark-50/50 transition-colors duration-150 group"
              >
                {/* Column 1: Title and Description subtext */}
                <div className="col-span-5 flex flex-col min-w-0 pr-4">
                  <span className="text-caption1-bold text-main-font leading-tight tracking-tight uppercase">
                    {log.title}
                  </span>
                  <span className="text-caption1-bold text-dark-200 font-bold tracking-tight leading-none mt-1.5">
                    {log.body}
                  </span>
                </div>

                {/* Column 2: Audience label (Customer/Provider/All) */}
                <div className="col-span-2 flex justify-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-[6px] bg-dark-50 border border-border/50 text-caption1-bold text-dark-300 uppercase tracking-tight select-none">
                    {log.audience}
                  </span>
                </div>

                {/* Column 3: Date & Time */}
                <div className="col-span-3 text-center text-caption1 font-semibold text-subtitle-2">
                  {log.dateTime}
                </div>

                {/* Column 4: Status badge (Sent green vs Scheduled blue) */}
                <div className="col-span-2 flex justify-end">
                  {log.status === 'Sent' ? (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-caption1-bold tracking-wider border uppercase bg-[#E6FFEB] text-[#139615] border-[#139615]/15 select-none">
                      Sent
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-caption1-bold tracking-wider border uppercase bg-[#E6F4FF] text-[#1473E6] border-[#1473E6]/15 select-none">
                      Scheduled
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}

function NotificationsLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse w-full pb-8">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-dark-50 rounded-lg"></div>
        <div className="h-3 w-64 bg-dark-50 rounded-lg"></div>
      </div>
      <div className="h-96 w-full bg-dark-50 rounded-2xl"></div>
    </div>
  );
}
