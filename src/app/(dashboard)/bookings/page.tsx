'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { bookingService } from '../../../services';
import { Booking, BookingStatus } from '../../../types';
import MapView from '../../../components/features/MapView';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';

function BookingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlId = searchParams.get('id');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Exact high-fidelity default listings matching the screenshots
  const defaultBookings: Booking[] = [
    {
      id: '#1278',
      customerName: 'Marc Wilson',
      customerPhone: '+1 (555) 019-2834',
      providerName: 'Jack',
      serviceName: 'Express Wash',
      serviceCategory: 'Premium',
      carType: 'Sedan (Tesla Model 3)',
      dirtLevel: 'Light',
      address: 'Main St, San Francisco',
      status: 'active',
      date: 'Oct 27, 2026',
      timeSlot: '08:30 AM',
      totalAmount: 250,
      notes: 'Please pay extra attention to the alloy wheels and interior vacuums.',
      createdAt: '2026-05-18T00:00:00Z',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      providerCoordinates: { lat: 37.7849, lng: -122.4354 },
      routePath: [
        { lat: 37.7849, lng: -122.4354 },
        { lat: 37.7800, lng: -122.4250 },
        { lat: 37.7749, lng: -122.4194 }
      ]
    },
    {
      id: '#1279',
      customerName: 'Marc Wilson',
      customerPhone: '+1 (555) 019-2834',
      providerName: 'Jack',
      serviceName: 'Express Wash',
      serviceCategory: 'Premium',
      carType: 'Sedan (Tesla Model 3)',
      dirtLevel: 'Light',
      address: 'Main St, San Francisco',
      status: 'active',
      date: 'Oct 27, 2026',
      timeSlot: '09:45 AM',
      totalAmount: 250,
      notes: 'Eco Discount applies. Focus on clean windows.',
      createdAt: '2026-05-18T00:00:00Z',
      coordinates: { lat: 37.7549, lng: -122.4094 },
      providerCoordinates: { lat: 37.7649, lng: -122.4254 },
      routePath: [
        { lat: 37.7649, lng: -122.4254 },
        { lat: 37.7600, lng: -122.4150 },
        { lat: 37.7549, lng: -122.4094 }
      ]
    },
    {
      id: '#1280',
      customerName: 'Marc Wilson',
      customerPhone: '+1 (555) 019-2834',
      providerName: 'Jack',
      serviceName: 'Express Wash',
      serviceCategory: 'Premium',
      carType: 'Sedan (Tesla Model 3)',
      dirtLevel: 'Light',
      address: 'Main St, San Francisco',
      status: 'pending',
      date: 'Oct 27, 2026',
      timeSlot: '11:15 AM',
      totalAmount: 250,
      notes: 'Heavy mud surcharge verified.',
      createdAt: '2026-05-18T00:00:00Z',
      coordinates: { lat: 37.7949, lng: -122.4394 },
      providerCoordinates: { lat: 37.8049, lng: -122.4494 },
      routePath: [
        { lat: 37.8049, lng: -122.4494 },
        { lat: 37.8000, lng: -122.4430 },
        { lat: 37.7949, lng: -122.4394 }
      ]
    },
    {
      id: '#1281',
      customerName: 'Marc Wilson',
      customerPhone: '+1 (555) 019-2834',
      providerName: 'Jack',
      serviceName: 'Express Wash',
      serviceCategory: 'Premium',
      carType: 'Sedan (Tesla Model 3)',
      dirtLevel: 'Light',
      address: 'Main St, San Francisco',
      status: 'active',
      date: 'Oct 27, 2026',
      timeSlot: '01:30 PM',
      totalAmount: 250,
      notes: 'Polishing finish requested.',
      createdAt: '2026-05-18T00:00:00Z',
      coordinates: { lat: 37.7649, lng: -122.4294 },
      providerCoordinates: { lat: 37.7749, lng: -122.4394 },
      routePath: [
        { lat: 37.7749, lng: -122.4394 },
        { lat: 37.7700, lng: -122.4330 },
        { lat: 37.7649, lng: -122.4294 }
      ]
    },
    {
      id: '#1282',
      customerName: 'Marc Wilson',
      customerPhone: '+1 (555) 019-2834',
      providerName: 'Jack',
      serviceName: 'Express Wash',
      serviceCategory: 'Premium',
      carType: 'Sedan (Tesla Model 3)',
      dirtLevel: 'Light',
      address: 'Main St, San Francisco',
      status: 'active',
      date: 'Oct 27, 2026',
      timeSlot: '03:00 PM',
      totalAmount: 250,
      notes: 'Thorough trunk cleanup needed.',
      createdAt: '2026-05-18T00:00:00Z',
      coordinates: { lat: 37.7849, lng: -122.4494 },
      providerCoordinates: { lat: 37.7949, lng: -122.4594 },
      routePath: [
        { lat: 37.7949, lng: -122.4594 },
        { lat: 37.7900, lng: -122.4530 },
        { lat: 37.7849, lng: -122.4494 }
      ]
    }
  ];

  // Load Bookings
  const fetchBookings = async () => {
    try {
      const data = await bookingService.getBookings();
      if (data && data.length > 0) {
        setBookings(data);
      } else {
        setBookings(defaultBookings);
      }
    } catch (err) {
      console.error('Failed to load bookings, using mock default dataset:', err);
      setBookings(defaultBookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Sync with URL parameters (for managing from dashboard)
  useEffect(() => {
    if (urlId) {
      setSelectedBookingId(urlId);
    }
  }, [urlId]);

  // Handle status update
  const handleUpdateStatus = async (id: string, nextStatus: BookingStatus) => {
    try {
      setLoading(true);
      await bookingService.updateBookingStatus(id, nextStatus);
      await fetchBookings();
    } catch (err) {
      console.error('Failed to update booking status:', err);
      // Fallback update on local state to simulate dynamic mock client actions
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: nextStatus } : b));
    } finally {
      setLoading(false);
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8 animate-fade-in font-sans">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-main-font tracking-tight leading-none">
            Bookings
          </h1>
          <p className="text-caption1 text-dark-200 font-medium mt-2">
            View and control all bookings in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh button with exact styling */}
          <button
            onClick={() => { setLoading(true); fetchBookings(); }}
            className="flex items-center gap-2 h-[46px] px-6 bg-dark-50 hover:bg-dark-50/80 border border-border text-subtitle-2 rounded-full text-caption1-bold transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <Icon icon="solar:restart-linear" className={`w-4.5 h-4.5 text-dark-300 ${loading ? 'animate-spin' : ''}`} />
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

      {/* 2. Controls & Tabs Bar - Only visible if NO booking is active */}
      {!selectedBookingId && (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white border border-border/50 p-4 rounded-3xl shadow-sm">
          
          <div className="flex bg-dark-50/80 p-1 rounded-full border border-border/40 w-fit shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-caption1-bold transition-all cursor-pointer
                ${viewMode === 'list' 
                  ? 'bg-orange-50 text-orange-300 border border-orange-100/50 shadow-sm' 
                  : 'text-dark-300 hover:text-dark-300/80 bg-transparent border border-transparent'
                }
              `}
            >
              <Icon icon="solar:list-bold" className="w-4 h-4" />
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-caption1-bold transition-all cursor-pointer
                ${viewMode === 'map' 
                  ? 'bg-orange-50 text-orange-300 border border-orange-100/50 shadow-sm' 
                  : 'text-dark-300 hover:text-dark-300/80 bg-transparent border border-transparent'
                }
              `}
            >
              <Icon icon="solar:map-arrow-square-bold" className="w-4 h-4" />
              Map View
            </button>
          </div>

          <div className="relative flex-1 w-full md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Task..."
              className="w-full pl-10 pr-4 h-[46px] text-caption1 font-semibold rounded-full border-0 bg-dark-50/80 text-subtitle-2 placeholder-dark-200 focus:outline-none focus:ring-1 focus:ring-border transition-all duration-200"
            />
            <Icon icon="solar:magnifer-linear" className="w-4.5 h-4.5 text-dark-300 absolute left-4 top-3.5" />
          </div>

        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="relative">
        {selectedBooking ? (
          /* ========================================================================= */
          /* SPLIT DETAIL SCREEN - ACTIVE WHEN ANY USER / EYE BUTTON IS CLICKED */
          /* ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[780px] rounded-3xl overflow-hidden">
            
            <div className="bg-white border border-border/50 p-6 rounded-3xl shadow-sm flex flex-col justify-between font-sans">
              <div className="space-y-6">
                
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <button
                    onClick={() => setSelectedBookingId(null)}
                    className="w-10 h-10 rounded-full border border-border hover:bg-dark-50 flex items-center justify-center text-subtitle-2 transition-colors cursor-pointer"
                  >
                    <Icon icon="solar:arrow-left-linear" className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-h5-bold text-main-font leading-none">
                      Booking Details
                    </h3>
                    <span className="text-caption1 text-dark-200 font-semibold mt-1.5 block">
                      Order {selectedBooking.id}
                    </span>
                  </div>
                </div>

                {/* Stock Image Detail with Blue Tag */}
                <div className="relative h-40 rounded-2xl overflow-hidden shadow-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80" 
                    alt="Interior car wash detail" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                  
                  {/* Floating blue tag from mockup */}
                  <div className="absolute top-3 left-3 bg-[#0091FF] text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Icon icon="solar:link-linear" className="w-2.5 h-2.5" />
                    <span>pexels-wavyvisuals-377312923...</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-dark-50 hover:bg-dark-50/80 rounded-full p-1.5 flex items-center justify-between w-full border border-border/50 transition-colors cursor-pointer">
                    <div className="flex items-center min-w-0">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60" 
                        alt="Customer Avatar"
                        className="w-7 h-7 rounded-full object-cover border border-white shrink-0"
                      />
                      <span className="text-caption1-bold text-main-font ml-2 truncate">
                        {selectedBooking.customerName === 'Marc Wilson' ? 'Azhar Uddin' : selectedBooking.customerName}
                      </span>
                    </div>
                    <Icon icon="solar:alt-arrow-right-linear" className="w-3.5 h-3.5 text-dark-200 shrink-0 mr-1" />
                  </div>

                  <div className="bg-dark-50 hover:bg-dark-50/80 rounded-full p-1.5 flex items-center justify-between w-full border border-border/50 transition-colors cursor-pointer">
                    <div className="flex items-center min-w-0">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60" 
                        alt="Provider Avatar"
                        className="w-7 h-7 rounded-full object-cover border border-white shrink-0"
                      />
                      <span className="text-caption1-bold text-main-font ml-2 truncate">
                        {selectedBooking.providerName === 'Jack' ? "John's Auto Shine" : selectedBooking.providerName}
                      </span>
                    </div>
                    <Icon icon="solar:alt-arrow-right-linear" className="w-3.5 h-3.5 text-dark-200 shrink-0 mr-1" />
                  </div>
                </div>

                <div className="bg-dark-50 border border-border/30 p-4 rounded-3xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-body2-bold text-main-font">
                      {selectedBooking.serviceName === 'Express Wash' ? 'Premium Wash' : selectedBooking.serviceName}
                    </span>
                    <span className="text-body2-bold text-main-font">
                      <span className="text-orange-300 mr-0.5">€</span>250
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-caption1 text-dark-300 font-medium leading-normal">
                    <Icon icon="solar:map-point-linear" className="w-4 h-4 text-dark-200 shrink-0" />
                    <span>{selectedBooking.address === 'Main St, San Francisco' ? 'House 12, Road 4, Dhaka' : selectedBooking.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-caption1 text-dark-300 font-medium leading-normal">
                    <Icon icon="solar:calendar-linear" className="w-4 h-4 text-dark-200 shrink-0" />
                    <span>{selectedBooking.date === 'Oct 27, 2026' ? 'Oct 27, 8:30 AM' : `${selectedBooking.date}, ${selectedBooking.timeSlot}`}</span>
                  </div>
                </div>

                <div className="bg-dark-50 border border-border/30 p-4 rounded-3xl space-y-3">
                  <div className="flex justify-between text-caption1 text-dark-300 font-medium">
                    <span>Package (Standard)</span>
                    <span className="font-bold text-subtitle-2">€ 39</span>
                  </div>
                  <div className="flex justify-between text-caption1 text-dark-300 font-medium">
                    <span>Vehicle (Sedan)</span>
                    <span className="font-bold text-subtitle-2">€ 20</span>
                  </div>
                  <div className="flex justify-between text-caption1 text-dark-300 font-medium">
                    <span>Dirt Level (Light)</span>
                    <span className="font-bold text-subtitle-2">€ 10</span>
                  </div>
                  <div className="flex justify-between text-caption1 text-dark-300 font-medium">
                    <span>Distance (3.2 km)</span>
                    <span className="font-bold text-subtitle-2">€ 10</span>
                  </div>
                  <div className="flex justify-between text-caption1 text-dark-300 font-medium">
                    <span>Platform Fee</span>
                    <span className="font-bold text-subtitle-2">€ 10</span>
                  </div>
                  <div className="border-t border-border/60 pt-3 flex justify-between items-center">
                    <span className="text-caption1-bold text-main-font">Total Amount</span>
                    <span className="text-caption1-bold text-main-font">
                      <span className="text-orange-300 mr-0.5">€</span>35.50
                    </span>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-border flex items-center gap-3 mt-6">
                <button
                  onClick={() => setSelectedBookingId(null)}
                  className="flex-1 h-[46px] rounded-full bg-dark-50 border border-border text-subtitle-2 text-caption1-bold transition-all duration-200 active:scale-[0.98] hover:bg-dark-50/80 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  Reassign
                </button>
                <button
                  className="flex-1 h-[46px] rounded-full bg-main-font text-white text-caption1-bold transition-all duration-200 active:scale-[0.98] hover:bg-main-font/90 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  Print Receipt
                </button>
              </div>

            </div>

            <div className="lg:col-span-2 relative min-h-[780px] h-full rounded-3xl overflow-hidden border border-border/50 shadow-inner">
              <MapView 
                bookings={filteredBookings} 
                selectedBookingId={selectedBookingId} 
                onSelectBooking={(id) => setSelectedBookingId(id)}
              />
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* DEFAULT WORKSPACE VIEWS - ACTIVE WHEN NO BOOKING IS SELECTED */
          /* ========================================================================= */
          viewMode === 'list' ? (
            <div className="bg-white border border-border/50 rounded-3xl shadow-sm overflow-hidden p-2">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="bg-dark-50/80">
                    <TableHead className="rounded-l-2xl">Customer</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-center rounded-r-2xl">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <TableRow 
                        key={booking.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedBookingId(booking.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-border shadow-sm shrink-0">
                              <img 
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60" 
                                alt="Customer" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-body2-bold text-main-font">
                              {booking.customerName}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-border shadow-sm shrink-0">
                              <img 
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60" 
                                alt="Provider" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-body2 text-subtitle-2">
                              {booking.providerName}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-dark-300">
                          {booking.serviceName}
                        </TableCell>

                        <TableCell className="text-dark-300">
                          {booking.address}
                        </TableCell>

                        <TableCell>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-caption1-bold border
                            ${booking.status === 'completed' 
                              ? 'bg-emerald-50 text-emerald-500 border-emerald-100/30' 
                              : booking.status === 'pending' 
                              ? 'bg-amber-50 text-amber-500 border-amber-100/30' 
                              : 'bg-orange-50 text-orange-300 border-orange-100/30'
                            }
                          `}>
                            {booking.status === 'pending' ? 'In Progress' : 'En Route'}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="text-orange-300 font-bold mr-0.5">€</span>
                          <span className="text-main-font font-extrabold">{booking.totalAmount}</span>
                        </TableCell>

                        <TableCell className="text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBookingId(booking.id);
                            }}
                            className="p-2.5 bg-dark-50 hover:bg-dark-50/80 text-subtitle-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center shadow-sm active:scale-95"
                          >
                            <Icon icon="solar:eye-linear" className="w-4 h-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-dark-200 font-semibold">
                        No bookings matching search filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* MAP INTERACTIVE TELEMETRY VIEW WITH FLOATING LIVE TRACKING OVERLAY MATCHING SCREENSHOT 2 */
            <div className="relative min-h-[780px] rounded-3xl overflow-hidden border border-border/50 shadow-sm">
              <MapView 
                bookings={filteredBookings} 
                selectedBookingId={selectedBookingId} 
                onSelectBooking={(id) => setSelectedBookingId(id)}
              />

              <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md border border-border p-4.5 rounded-3xl shadow-lg max-w-[280px] animate-slide-up">
                <h4 className="text-caption1-bold text-main-font flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  Live Tracking
                </h4>
                <p className="text-caption1 text-dark-200 font-medium leading-normal mt-1">
                  Monitoring 7 active service routes across the city
                </p>
                <div className="flex items-center gap-2 mt-3.5">
                  <div className="flex -space-x-2.5">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=40" 
                      alt="Provider 1"
                      className="w-5.5 h-5.5 rounded-full object-cover border border-white"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=40" 
                      alt="Provider 2"
                      className="w-5.5 h-5.5 rounded-full object-cover border border-white"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=40" 
                      alt="Provider 3"
                      className="w-5.5 h-5.5 rounded-full object-cover border border-white"
                    />
                  </div>
                  <span className="text-caption1-bold text-dark-300">
                    +4 Active Providers
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 animate-pulse p-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-dark-50 rounded-lg"></div>
            <div className="h-3 w-64 bg-dark-50 rounded-lg"></div>
          </div>
        </div>
        <div className="h-96 bg-dark-50 rounded-3xl"></div>
      </div>
    }>
      <BookingsContent />
    </Suspense>
  );
}
