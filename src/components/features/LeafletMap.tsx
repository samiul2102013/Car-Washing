'use strict';
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Booking } from '../../types';

// Custom icons matching premium reverse-engineered style
const createCustomerIcon = () => {
  return L.divIcon({
    className: 'custom-customer-pin',
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white shadow-lg border-2 border-white relative">
        <span class="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 animate-ping -z-10"></span>
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const createProviderIcon = () => {
  return L.divIcon({
    className: 'custom-provider-pin',
    html: `
      <div class="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-450 text-slate-800 shadow-xl border-2 border-white relative">
        <span class="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-50 animate-pulse -z-10"></span>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16V10a2 2 0 00-2-2h-3V6a1 1 0 00-1-1H12M21 16h-5"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

interface LeafletMapProps {
  bookings: Booking[];
  selectedBookingId?: string | null;
  onSelectBooking?: (bookingId: string) => void;
}

export default function LeafletMap({ bookings, selectedBookingId, onSelectBooking }: LeafletMapProps) {
  // Center of San Francisco
  const centerPosition: [number, number] = [37.7749, -122.4194];

  // Dynamic focus: center map if a specific booking is selected
  const focusedBooking = selectedBookingId 
    ? bookings.find(b => b.id === selectedBookingId) 
    : null;
  
  const mapCenter: [number, number] = focusedBooking
    ? [focusedBooking.coordinates.lat, focusedBooking.coordinates.lng]
    : centerPosition;

  const mapZoom = focusedBooking ? 14 : 12;

  // React Leaflet sometimes requires explicit map re-centering
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [focusedBooking]);

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200/50">
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {bookings.map((booking) => {
          const { lat, lng } = booking.coordinates;

          return (
            <div key={booking.id}>
              {/* Customer Pin */}
              <Marker
                position={[lat, lng]}
                icon={createCustomerIcon()}
                eventHandlers={{
                  click: () => onSelectBooking && onSelectBooking(booking.id),
                }}
              >
                <Popup className="premium-map-popup">
                  <div className="p-1 max-w-sm">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 uppercase">
                        Client Location
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-500">
                        {booking.id}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {booking.customerName}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {booking.serviceName} • <span className="font-semibold text-orange-500">{booking.carType}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                      {booking.address}
                    </p>
                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">{booking.timeSlot}</span>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        booking.status === 'active' ? 'bg-orange-50 text-orange-500' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* Provider Pin (Only if wash session is active and coordinates exist) */}
              {booking.status === 'active' && booking.providerCoordinates && (
                <Marker
                  position={[booking.providerCoordinates.lat, booking.providerCoordinates.lng]}
                  icon={createProviderIcon()}
                >
                  <Popup>
                    <div className="p-1">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600">
                        Active Wash Van
                      </span>
                      <h4 className="font-bold text-slate-800 mt-1.5 text-sm">{booking.providerName}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Heading to {booking.customerName}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Route Overlay (Only if active and route path coordinates are defined) */}
              {booking.status === 'active' && booking.routePath && (
                <Polyline
                  positions={booking.routePath.map(p => [p.lat, p.lng])}
                  color="#1E293B"
                  weight={3.5}
                  opacity={0.95}
                />
              )}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
