'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function CreateServicePage() {
  const [mounted, setMounted] = useState(false);

  // Input states
  const [engineType, setEngineType] = useState<'Petrol' | 'Electric'>('Electric');
  const [serviceName, setServiceName] = useState('Standard Wash');
  const [basePrice, setBasePrice] = useState('€ 39');
  const [description, setDescription] = useState('Standard Wash');

  // Dirt Level Config
  const [dirtLight, setDirtLight] = useState('Light');
  const [dirtLightPrice, setDirtLightPrice] = useState('€ 39');
  const [dirtMedium, setDirtMedium] = useState('Medium');
  const [dirtMediumPrice, setDirtMediumPrice] = useState('€ 39');
  const [dirtHeavy, setDirtHeavy] = useState('Heavy');
  const [dirtHeavyPrice, setDirtHeavyPrice] = useState('€ 39');

  // Platform Fee
  const [feeType, setFeeType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [feeAmount, setFeeAmount] = useState('€ 39');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <CreateServiceSkeleton />;
  }

  return (
    <div className="space-y-8 w-full pb-12 animate-fade-in font-sans">
      
      {/* 1. Header with Circular Back Button */}
      <div className="flex items-center gap-4">
        <Link
          href="/services"
          className="w-10 h-10 rounded-full bg-dark-50 border border-border/50 hover:bg-dark-50 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Icon icon="solar:arrow-left-linear" className="w-5 h-5 text-main-font" />
        </Link>
        <div>
          <h1 className="text-h3 text-main-font tracking-tight leading-none">
            Create New Service
          </h1>
          <p className="text-caption1 text-dark-200 font-semibold mt-3.5 leading-none">
            Create a new service with customizable pricing, packages, and conditions.
          </p>
        </div>
      </div>

      {/* 2. Service Details Card */}
      <div className="bg-white border border-border rounded-xl p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-h5-bold text-main-font tracking-tight">
            Service Details
          </h3>
        </div>

        {/* Image Upload Area */}
        <div className="space-y-2.5">
          <span className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
            Service Image
          </span>
          <div className="border-2 border-dashed border-[#B9B9B9] rounded-[11px] bg-dark-50/50 h-[220px] flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-dark-50 transition-all duration-200 shadow-sm group">
            <Icon icon="solar:cloud-upload-linear" className="w-12 h-12 text-[#B9B9B9] mb-3 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold text-main-font block">
              Click to upload image
            </span>
            <span className="text-caption1 text-dark-200 mt-1.5 block">
              PNG, JPG up to 5MB
            </span>
          </div>
        </div>

        {/* Engine Type dropdown input (exactly pill shaped and high fidelity) */}
        <div className="space-y-2">
          <span className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
            Engine Type
          </span>
          <div className="relative">
            <select
              value={engineType}
              onChange={(e) => setEngineType(e.target.value as 'Petrol' | 'Electric')}
              className="w-full h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all appearance-none cursor-pointer"
            >
              <option value="Electric">Electric</option>
              <option value="Petrol">Petrol</option>
            </select>
            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-dark-300">
              <Icon icon="solar:alt-arrow-down-linear" className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Service Name & Base Price row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
              Service Name
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font placeholder-dark-200 focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
              Base Price (€)
            </label>
            <input
              type="text"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font placeholder-dark-200 focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
            />
          </div>
        </div>

        {/* Description textbox (Satoshi exact typography) */}
        <div className="space-y-2">
          <label className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-dark-50/60 rounded-2xl p-6 text-sm font-semibold text-main-font placeholder-dark-200 border-0 focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all resize-none"
          />
        </div>
      </div>

      {/* 3. Bottom Columns (Dirt Level Config & Platform Fee) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Dirt Level Configuration Card */}
        <div className="bg-white border border-border rounded-xl p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-h5-bold text-main-font tracking-tight mb-6">
              Dirt Level Configuration
            </h3>
            
            {/* Headers row */}
            <div className="grid grid-cols-2 text-caption1-bold text-dark-200 uppercase tracking-widest px-1 mb-2">
              <div>Dirt Level Name</div>
              <div className="pl-2">Additional Price</div>
            </div>

            {/* Inputs list matching exactly Screenshot 1 */}
            <div className="space-y-4">
              {/* Row 1: Light */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={dirtLight}
                  onChange={(e) => setDirtLight(e.target.value)}
                  className="h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
                />
                <input
                  type="text"
                  value={dirtLightPrice}
                  onChange={(e) => setDirtLightPrice(e.target.value)}
                  className="h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
                />
              </div>

              {/* Row 2: Medium */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={dirtMedium}
                  onChange={(e) => setDirtMedium(e.target.value)}
                  className="h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
                />
                <input
                  type="text"
                  value={dirtMediumPrice}
                  onChange={(e) => setDirtMediumPrice(e.target.value)}
                  className="h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
                />
              </div>

              {/* Row 3: Heavy */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={dirtHeavy}
                  onChange={(e) => setDirtHeavy(e.target.value)}
                  className="h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
                />
                <input
                  type="text"
                  value={dirtHeavyPrice}
                  onChange={(e) => setDirtHeavyPrice(e.target.value)}
                  className="h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Platform Fee Card */}
        <div className="bg-white border border-border rounded-xl p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-h5-bold text-main-font tracking-tight">
              Platform Fee
            </h3>
          </div>

          {/* Toggle Tabs container matching exactly Percentage vs Fixed */}
          <div className="bg-dark-50/60 rounded-full h-[59px] flex items-center p-1.5 w-full select-none">
            <button
              onClick={() => setFeeType('Percentage')}
              className={`flex-1 h-full flex items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer
                ${feeType === 'Percentage'
                  ? 'bg-white text-orange-300 shadow-sm font-black'
                  : 'text-dark-300 hover:text-main-font bg-transparent'
                }
              `}
            >
              Percentage (%)
            </button>
            <button
              onClick={() => setFeeType('Fixed')}
              className={`flex-1 h-full flex items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer
                ${feeType === 'Fixed'
                  ? 'bg-white text-orange-300 shadow-sm font-black'
                  : 'text-dark-300 hover:text-main-font bg-transparent'
                }
              `}
            >
              Fixed
            </button>
          </div>

          {/* Fee amount field input */}
          <div className="space-y-2">
            <label className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
              Fee Amount (€)
            </label>
            <input
              type="text"
              value={feeAmount}
              onChange={(e) => setFeeAmount(e.target.value)}
              className="w-full h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
            />
            <span className="block text-caption1 text-dark-200 font-bold uppercase tracking-wider mt-2.5">
              This fee is added to the final total charged to the customer.
            </span>
          </div>
        </div>

      </div>

      {/* 4. Action Buttons Row (Draft vs Publish) */}
      <div className="flex flex-col sm:flex-row justify-end pt-4 gap-4 w-full">
        <Link
          href="/services"
          className="flex items-center justify-center w-full sm:w-1/2 lg:w-[280px] h-[59px] bg-dark-50 hover:bg-[#DCE0E5] text-dark-300 rounded-full text-sm font-bold transition-all shadow-sm cursor-pointer active:scale-95 text-center"
        >
          Save as Draft
        </Link>
        <Link
          href="/services"
          className="flex items-center justify-center w-full sm:w-1/2 lg:w-[280px] h-[59px] bg-main-font hover:bg-main-font/90 text-white rounded-full text-sm font-bold transition-all shadow-md cursor-pointer active:scale-95 text-center gap-2"
        >
          <Icon icon="solar:folder-check-linear" className="w-5 h-5 text-white" />
          Save & Publish
        </Link>
      </div>

    </div>
  );
}

function CreateServiceSkeleton() {
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
