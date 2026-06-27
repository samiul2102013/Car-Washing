'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { serviceConfigService, vehicleTypeService, engineTypeService, dirtLevelService } from '../../../../services';
import { VehicleType, EngineType, DirtLevel } from '../../../../types';

export default function CreateServicePage() {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  // Input states
  const [serviceName, setServiceName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [description, setDescription] = useState('');

  // Vehicle & Engine type selectors
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [engineTypes, setEngineTypes] = useState<EngineType[]>([]);
  const [dirtLevels, setDirtLevels] = useState<DirtLevel[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState<number | ''>('');
  const [selectedEngineType, setSelectedEngineType] = useState<number | ''>('');

  // Platform Fee
  const [feeType, setFeeType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [feeAmount, setFeeAmount] = useState('€ 39');

  useEffect(() => {
    (async () => {
      const [vts, ets, dls] = await Promise.all([
        vehicleTypeService.list().catch(() => []),
        engineTypeService.list().catch(() => []),
        dirtLevelService.list().catch(() => []),
      ]);
      setVehicleTypes(vts);
      setEngineTypes(ets);
      setDirtLevels(dls);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(basePrice.replace(/[^0-9.]/g, '')) || 0;
    if (!serviceName || !price) return;
    try {
      setSending(true);
      await serviceConfigService.addService({
        name: serviceName,
        description,
        basePrice: price,
        isActive: true,
        vehicleType: selectedVehicleType || null,
        engineType: selectedEngineType || null,
      });
      router.push('/services');
    } catch (err) {
      console.error('Failed to create service:', err);
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full pb-12 animate-fade-in font-sans">

      {/* 1. Header */}
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
              required
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
              required
              className="w-full h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font placeholder-dark-200 focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
            />
          </div>
        </div>

        {/* Vehicle Type & Engine Type selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
              Vehicle Type
            </label>
            <select
              value={selectedVehicleType}
              onChange={(e) => setSelectedVehicleType(e.target.value ? Number(e.target.value) : '')}
              className="w-full h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all appearance-none"
            >
              <option value="">None</option>
              {vehicleTypes.map((vt) => (
                <option key={vt.id} value={vt.id}>{vt.name} (€{vt.extraPrice.toFixed(2)})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
              Engine Type
            </label>
            <select
              value={selectedEngineType}
              onChange={(e) => setSelectedEngineType(e.target.value ? Number(e.target.value) : '')}
              className="w-full h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all appearance-none"
            >
              <option value="">None</option>
              {engineTypes.map((et) => (
                <option key={et.id} value={et.id}>{et.engineType} ({et.discountPercent}% off)</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description textbox */}
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
              <div>Dirt Level</div>
              <div className="pl-2">Extra Price</div>
            </div>

            <div className="space-y-4">
              {['light', 'medium', 'heavy'].map((level) => {
                const dl = dirtLevels.find((d) => d.level === level);
                return (
                  <div key={level} className="grid grid-cols-2 gap-4 items-center">
                    <div className="h-[59px] px-6 text-sm font-semibold rounded-full bg-dark-50/60 text-main-font flex items-center capitalize">
                      {level}
                    </div>
                    <div className="h-[59px] px-6 text-sm font-semibold rounded-full bg-dark-50/60 text-orange-300 font-black flex items-center">
                      {dl ? `€ ${dl.extraPrice.toFixed(2)}` : '—'}
                    </div>
                  </div>
                );
              })}
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

          <div className="bg-dark-50/60 rounded-full h-[59px] flex items-center p-1.5 w-full select-none">
            <button
              type="button"
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
              type="button"
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

      {/* 4. Action Buttons Row */}
      <div className="flex flex-col sm:flex-row justify-end pt-4 gap-4 w-full">
        <Link
          href="/services"
          className="flex items-center justify-center w-full sm:w-1/2 lg:w-[280px] h-[59px] bg-dark-50 hover:bg-[#DCE0E5] text-dark-300 rounded-full text-sm font-bold transition-all shadow-sm cursor-pointer active:scale-95 text-center"
        >
          Save as Draft
        </Link>
        <button
          type="submit"
          disabled={sending}
          className="flex items-center justify-center w-full sm:w-1/2 lg:w-[280px] h-[59px] bg-main-font hover:bg-main-font/90 text-white rounded-full text-sm font-bold transition-all shadow-md cursor-pointer active:scale-95 text-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Icon icon="solar:folder-check-linear" className="w-5 h-5 text-white" />
          {sending ? 'Creating...' : 'Save & Publish'}
        </button>
      </div>

    </form>
  );
}
