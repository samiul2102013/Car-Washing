'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';

interface CarTypeItem {
  id: string;
  name: string;
  engineType: 'Petrol' | 'Electric';
  basePrice: number;
  status: 'Active' | 'Draft';
  imageUrl: string;
}

export default function CarTypesPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Petrol' | 'Electric'>('All');
  const [mounted, setMounted] = useState(false);

  // Form states matching SVG design
  const [engineType, setEngineType] = useState<'Petrol' | 'Electric'>('Petrol');
  const [carName, setCarName] = useState('');
  const [basePrice, setBasePrice] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const figmaCarTypes: CarTypeItem[] = [
    {
      id: 'car-1',
      name: 'SEDAN',
      engineType: 'Petrol',
      basePrice: 250,
      status: 'Active',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&q=80'
    },
    {
      id: 'car-2',
      name: 'SEDAN',
      engineType: 'Petrol',
      basePrice: 250,
      status: 'Active',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&q=80'
    },
    {
      id: 'car-3',
      name: 'SEDAN',
      engineType: 'Electric',
      basePrice: 250,
      status: 'Active',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&q=80'
    },
    {
      id: 'car-4',
      name: 'SEDAN',
      engineType: 'Electric',
      basePrice: 250,
      status: 'Active',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&q=80'
    }
  ];

  if (!mounted) {
    return <CarTypesLoadingSkeleton />;
  }

  // Filter list by Engine
  const displayCarTypes = figmaCarTypes.filter(c => {
    if (activeTab === 'All') return true;
    return c.engineType === activeTab;
  });

  const handleClearForm = () => {
    setCarName('');
    setBasePrice('');
    setEngineType('Petrol');
  };

  return (
    <div className="space-y-8 w-full pb-12 animate-fade-in font-sans">
      
      {/* 1. Header with circular back button (Figma exact alignment) */}
      <div className="flex items-center gap-4">
        <Link
          href="/services"
          className="w-10 h-10 rounded-full bg-dark-50 border border-border/50 hover:bg-dark-50 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Icon icon="solar:arrow-left-linear" className="w-5 h-5 text-main-font" />
        </Link>
        <div>
          <h1 className="text-h3 text-main-font tracking-tight leading-none">
            Manage Car Types
          </h1>
          <p className="text-caption1 text-dark-200 font-semibold mt-3.5 leading-none">
            Create and manage vehicle categories with engine type and pricing.
          </p>
        </div>
      </div>

      {/* 2. Add New Car Type Permanent Inline Card Form (Exact matching SVG styling and dimensions) */}
      <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
        
        <div className="mb-6">
          <h3 className="text-h5-bold text-main-font tracking-tight">
            Add New Car Type
          </h3>
          <p className="text-caption1-bold text-dark-200 mt-1.5 leading-none uppercase tracking-wider">
            Create vehicle category
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* Left Column: Image Upload Area (h-[354px] from SVG) */}
          <div className="space-y-2.5 w-full">
            <span className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
              Car Image
            </span>
            <div className="border-2 border-dashed border-[#B9B9B9] rounded-[11px] bg-dark-50/50 h-[354px] flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-dark-50 transition-all duration-200 shadow-sm group">
              <Icon icon="solar:cloud-upload-linear" className="w-16 h-16 text-[#B9B9B9] mb-4 group-hover:scale-105 transition-transform" />
              <span className="text-sm font-bold text-subtitle-2 block">
                Click to upload or drag image
              </span>
              <span className="text-caption1 text-dark-200 mt-2 block">
                PNG, JPG up to 5MB
              </span>
            </div>
          </div>

          {/* Right Column: Engine, Name & Price inputs */}
          <div className="space-y-6 w-full">
            
            {/* Engine Type Selector Blocks (h-[125px] from SVG) */}
            <div className="space-y-2">
              <span className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
                Engine Type
              </span>
              <div className="flex gap-5">
                {/* Petrol selector */}
                <button
                  type="button"
                  onClick={() => setEngineType('Petrol')}
                  className={`w-1/2 h-[125px] rounded-xl flex flex-col items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer border active:scale-[0.98]
                    ${engineType === 'Petrol'
                      ? 'bg-orange-50 border-orange-300 text-orange-300 shadow-sm'
                      : 'bg-dark-50 border-border/50 text-dark-200 hover:bg-dark-50/50'
                    }
                  `}
                >
                  <Icon icon="solar:gas-station-linear" className="w-9 h-9" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Petrol
                  </span>
                </button>
                
                {/* Electric selector */}
                <button
                  type="button"
                  onClick={() => setEngineType('Electric')}
                  className={`w-1/2 h-[125px] rounded-xl flex flex-col items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer border active:scale-[0.98]
                    ${engineType === 'Electric'
                      ? 'bg-[#E6F4EA]/60 border-[#137333]/25 text-[#137333] shadow-sm'
                      : 'bg-dark-50 border-border/50 text-dark-200 hover:bg-dark-50/50'
                    }
                  `}
                >
                  <Icon icon="solar:bolt-circle-linear" className="w-9 h-9" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Electric
                  </span>
                </button>
              </div>
            </div>

            {/* Car Name Input (h-[59px] from SVG) */}
            <div className="space-y-2">
              <label className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
                Car Name
              </label>
              <input
                type="text"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                placeholder="e.g. Sedan, SUV"
                className="w-full h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font placeholder-dark-200 focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
              />
            </div>

            {/* Base Price Input (h-[59px] from SVG) */}
            <div className="space-y-2">
              <label className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
                Base Price
              </label>
              <input
                type="text"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="€ 250"
                className="w-full h-[59px] px-6 text-sm font-extrabold rounded-full border-0 bg-dark-50/60 text-main-font placeholder-dark-200 focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
              />
            </div>

            {/* Action Buttons Row (Clear: w-[276px] h-[58px], Add: w-[277px] h-[59px] from SVG) */}
            <div className="flex justify-end pt-4 gap-4">
              <button
                type="button"
                onClick={handleClearForm}
                className="flex items-center justify-center w-[276px] h-[58px] bg-dark-50 hover:bg-[#DCE0E5] text-dark-300 rounded-full text-sm font-bold transition-all shadow-sm cursor-pointer active:scale-95"
              >
                Clear Form
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-[277px] h-[59px] bg-main-font hover:bg-main-font/90 text-white rounded-full text-sm font-bold transition-all shadow-md cursor-pointer active:scale-95"
              >
                Add Car type
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 3. Existing Car Types List */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-h5-bold text-main-font tracking-tight">
            Existing Car Types
          </h2>
        </div>

        {/* Tab pill selectors (w-[564px] h-[56px] from SVG) */}
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

        {/* Existing Car Types Table Card */}
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Car Name</TableHead>
                <TableHead className="text-center">Engine Type</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayCarTypes.map((car, idx) => (
                <TableRow key={car.id + idx}>
                  {/* Car Image Box Column */}
                  <TableCell className="w-[80px]">
                    <div className="w-[48px] h-[36px] bg-dark-50 border border-border/50 rounded-[6px] overflow-hidden flex items-center justify-center p-1 shrink-0">
                      <svg className="w-full h-full text-dark-200" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                      </svg>
                    </div>
                  </TableCell>

                  {/* Car Name (Figma: SEDAN uppercase bold charcoal) */}
                  <TableCell className="font-black text-main-font">
                    {car.name}
                  </TableCell>

                  {/* Engine Type Column (Pump/Bolt in small grey square box) */}
                  <TableCell>
                    <div className="flex justify-center">
                      <div className="w-8 h-8 rounded-[8px] bg-dark-50 border border-border/50 flex items-center justify-center text-dark-300 shadow-sm">
                        <Icon 
                          icon={car.engineType === 'Petrol' ? 'solar:gas-station-linear' : 'solar:bolt-circle-linear'} 
                          className="w-4.5 h-4.5 text-dark-300" 
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Base Price Column */}
                  <TableCell>
                    <span className="text-orange-300 font-bold mr-1">€</span>
                    <span className="text-main-font font-extrabold">{car.basePrice}</span>
                  </TableCell>

                  {/* Status Column */}
                  <TableCell>
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-caption1-bold tracking-wider border uppercase bg-[#E6F4EA]/60 text-[#137333] border-[#137333]/15">
                      {car.status}
                    </span>
                  </TableCell>

                  {/* Actions edit and delete buttons */}
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {}}
                        className="p-1.5 bg-dark-50 hover:bg-[#E9EBEF] text-[#5C5F66] rounded-[6px] border border-border/50 transition-all cursor-pointer inline-flex items-center justify-center shadow-sm active:scale-95"
                      >
                        <Icon icon="solar:pen-linear" className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => {}}
                        className="p-1.5 bg-[#FFE6E6] hover:bg-[#FFD4D4] text-[#C5221F] rounded-[6px] border border-rose-200/30 transition-all cursor-pointer inline-flex items-center justify-center shadow-sm active:scale-95"
                      >
                        <Icon icon="solar:trash-bin-trash-linear" className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </div>

    </div>
  );
}

function CarTypesLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse w-full pb-8">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-dark-50 rounded-lg"></div>
        <div className="h-3 w-64 bg-dark-50 rounded-lg"></div>
      </div>
      <div className="h-80 w-full bg-dark-50 rounded-2xl"></div>
    </div>
  );
}
