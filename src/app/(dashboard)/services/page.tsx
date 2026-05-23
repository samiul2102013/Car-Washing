'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  engineSupported: 'Petrol' | 'Electric';
  status: 'Active' | 'Draft';
  lastUpdated: string;
  imageUrl: string;
}

export default function ServicesPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Petrol' | 'Electric'>('All');

  useEffect(() => {
    setMounted(true);
  }, []);

  const figmaServices: ServiceItem[] = [
    {
      id: 'srv-101',
      name: 'Standard Wash',
      description: 'Exterior wash, tire dressing',
      basePrice: 250,
      engineSupported: 'Petrol',
      status: 'Active',
      lastUpdated: '12/06/2026',
      imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=150&q=80'
    },
    {
      id: 'srv-102',
      name: 'Standard Wash',
      description: 'Exterior wash, tire dressing',
      basePrice: 250,
      engineSupported: 'Electric',
      status: 'Active',
      lastUpdated: '12/06/2026',
      imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=150&q=80'
    },
    {
      id: 'srv-103',
      name: 'Standard Wash',
      description: 'Exterior wash, tire dressing',
      basePrice: 250,
      engineSupported: 'Petrol',
      status: 'Active',
      lastUpdated: '12/06/2026',
      imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=150&q=80'
    },
    {
      id: 'srv-104',
      name: 'Standard Wash',
      description: 'Exterior wash, tire dressing',
      basePrice: 250,
      engineSupported: 'Electric',
      status: 'Active',
      lastUpdated: '12/06/2026',
      imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=150&q=80'
    }
  ];

  if (!mounted) {
    return <ServicesLoadingSkeleton />;
  }

  // Filter list by Engine type tab
  const displayServices = figmaServices.filter(s => {
    if (activeTab === 'All') return true;
    return s.engineSupported === activeTab;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 animate-fade-in font-sans">
      
      {/* 1. Header with exact SVG titles and custom w-[307px]/[308px] buttons */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div>
          <h1 className="text-h3 text-main-font tracking-tight leading-none">
            Services & Pricing
          </h1>
          <p className="text-caption1 text-dark-200 font-semibold mt-3.5 leading-none">
            Basic info like name, description, and image.
          </p>
        </div>

        {/* Action Button Capsules (w-[307px] h-[77px] and w-[308px] h-[78px] exact matching SVG) */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/car-types"
            className="flex items-center justify-center gap-2.5 w-[307px] h-[77px] rounded-full border border-[#B9B9B9] bg-dark-50 text-main-font text-sm font-black transition-all hover:bg-[#DCE0E5] shadow-sm cursor-pointer active:scale-95 select-none"
          >
            <Icon icon="solar:document-edit-linear" className="w-5 h-5 text-dark-300" />
            Manage Car Type
          </Link>
          
          {/* Navigation to Create New Service dedicated page */}
          <Link
            href="/services/create"
            className="flex items-center justify-center gap-2.5 w-[308px] h-[78px] rounded-full bg-main-font text-white text-sm font-black transition-all hover:bg-main-font/90 shadow-md cursor-pointer active:scale-95 select-none"
          >
            <Icon icon="solar:add-circle-linear" className="w-5.5 h-5.5" />
            Add Service
          </Link>
        </div>
      </div>

      {/* 2. Filter tabs for listing */}
      <div className="flex bg-dark-50/65 p-1 rounded-full border border-border/40 w-[564px] h-[56px] items-center shrink-0 select-none">
        <button
          onClick={() => setActiveTab('All')}
          className={`flex-1 h-full flex items-center justify-center rounded-full text-[12px] font-bold transition-all cursor-pointer
            ${activeTab === 'All' 
              ? 'bg-white text-orange-300 shadow-sm border border-border/50' 
              : 'text-dark-300 hover:text-main-font bg-transparent border border-transparent'
            }
          `}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('Petrol')}
          className={`flex-1 h-full flex items-center justify-center rounded-full text-[12px] font-bold transition-all cursor-pointer
            ${activeTab === 'Petrol' 
              ? 'bg-white text-orange-300 shadow-sm border border-border/50' 
              : 'text-dark-300 hover:text-main-font bg-transparent border border-transparent'
            }
          `}
        >
          Petrol
        </button>
        <button
          onClick={() => setActiveTab('Electric')}
          className={`flex-1 h-full flex items-center justify-center rounded-full text-[12px] font-bold transition-all cursor-pointer
            ${activeTab === 'Electric' 
              ? 'bg-white text-orange-300 shadow-sm border border-border/50' 
              : 'text-dark-300 hover:text-main-font bg-transparent border border-transparent'
            }
          `}
        >
          Electric
        </button>
      </div>

      {/* 3. Services Listing Beautiful Table Card (y=382 from SVG) */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden p-0 max-w-[1730px] w-full">
        
        {/* Table Header block with E9E9E9 background, height 66px from SVG */}
        <div className="w-full h-[66px] bg-dark-50 flex items-center px-8 border-b border-border/50">
          <div className="grid grid-cols-12 w-full text-caption1-bold text-dark-300 uppercase tracking-widest items-center">
            <div className="col-span-4 xl:col-span-5 pl-2">Services</div>
            <div className="col-span-2 text-left">Base Price</div>
            <div className="col-span-2 text-center">Engine Supported</div>
            <div className="col-span-2 text-left pl-4">Status</div>
            <div className="col-span-2 xl:col-span-1 text-center pr-2">Action</div>
          </div>
        </div>

        {/* Table body content items matching SVG coordinates */}
        <div className="divide-y divide-border px-6">
          {displayServices.map((service, idx) => (
            <div 
              key={service.id + idx}
              className="grid grid-cols-12 w-full py-4 items-center px-2 hover:bg-dark-50/50 transition-colors duration-150 group"
            >
              
              {/* Column 1: Services (w-[75px] h-[58px] image block + text from SVG) */}
              <div className="col-span-4 xl:col-span-5 flex items-center gap-4">
                <div className="w-[75px] h-[58px] rounded-[5px] overflow-hidden border border-border/50 bg-dark-50 shadow-sm shrink-0 flex items-center justify-center p-1.5">
                  <svg className="w-full h-full text-dark-200" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-caption1-bold text-main-font leading-tight group-hover:text-orange-300 transition-colors uppercase tracking-tight">
                    {service.name}
                  </span>
                  <span className="text-caption1-bold text-dark-200 tracking-tight leading-none mt-1.5">
                    {service.description}
                  </span>
                </div>
              </div>

              {/* Column 2: Base Price (Peach highlight € and € 250 bold from SVG) */}
              <div className="col-span-2 text-xs">
                <span className="text-orange-300 font-black mr-1.5">€</span>
                <span className="text-main-font font-black text-sm">{service.basePrice}</span>
              </div>

              {/* Column 3: Engine Supported */}
              <div className="col-span-2 flex justify-center">
                <div className="w-8 h-8 rounded-[8px] bg-dark-50 border border-border/50 flex items-center justify-center text-dark-300 shadow-sm">
                  <Icon 
                    icon={service.engineSupported === 'Petrol' ? 'solar:gas-station-linear' : 'solar:bolt-circle-linear'} 
                    className="w-4.5 h-4.5 text-dark-300" 
                  />
                </div>
              </div>

              {/* Column 4: Status (Active green background with border from SVG) */}
              <div className="col-span-2 text-left pl-4">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-caption1-bold tracking-wider border uppercase bg-[#E6FFEB] text-[#139615] border-[#139615]/15">
                  {service.status}
                </span>
              </div>

              {/* Column 5: Action (Edit w-[52px] h-[52px] bg E9E9E9 & Delete w-[52px] h-[52px] bg FFE6E6) */}
              <div className="col-span-2 xl:col-span-1 flex items-center justify-center gap-3">
                <button
                  onClick={() => {}}
                  className="w-[52px] h-[52px] bg-dark-50 hover:bg-[#DCE0E5] text-main-font rounded-[8px] transition-all cursor-pointer flex items-center justify-center shadow-sm active:scale-95 shrink-0"
                >
                  <Icon icon="solar:pen-linear" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {}}
                  className="w-[52px] h-[52px] bg-[#FFE6E6] hover:bg-[#FFD4D4] text-[#961313] rounded-[8px] transition-all cursor-pointer flex items-center justify-center shadow-sm active:scale-95 shrink-0"
                >
                  <Icon icon="solar:trash-bin-trash-linear" className="w-5 h-5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

function ServicesLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse w-full pb-8">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-dark-50 rounded-lg"></div>
        <div className="h-3 w-64 bg-dark-50 rounded-lg"></div>
      </div>
      <div className="h-40 w-full bg-dark-50 rounded-2xl"></div>
    </div>
  );
}
