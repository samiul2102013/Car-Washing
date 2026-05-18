'use strict';
'use client';

import dynamic from 'next/dynamic';
import { Booking } from '../../types';

// Dynamic client-only import with beautiful skeleton loading fallback
const DynamicLeafletMap = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false,
    loading: () => <MapLoadingSkeleton />
  }
);

interface MapViewProps {
  bookings: Booking[];
  selectedBookingId?: string | null;
  onSelectBooking?: (bookingId: string) => void;
}

export default function MapView({ bookings, selectedBookingId, onSelectBooking }: MapViewProps) {
  return (
    <div className="w-full h-[780px] min-h-[780px] relative rounded-3xl overflow-hidden">
      <DynamicLeafletMap 
        bookings={bookings} 
        selectedBookingId={selectedBookingId} 
        onSelectBooking={onSelectBooking} 
      />
    </div>
  );
}

function MapLoadingSkeleton() {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Absolute pulsing radar grids simulating a radar check */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Glimmer pulse circle */}
      <div className="relative flex items-center justify-center mb-4">
        <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-primary/20 opacity-75"></span>
        <div className="relative rounded-full p-4 bg-primary/10 text-primary border border-primary/20">
          <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
      </div>
      
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 relative z-10 animate-pulse">
        Initializing Interactive Wash Map...
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 relative z-10">
        Loading localized OpenStreetMap telemetry
      </p>
    </div>
  );
}
