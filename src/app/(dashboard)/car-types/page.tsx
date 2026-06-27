'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { vehicleTypeService, engineTypeService } from '../../../services';
import { VehicleType, EngineType } from '../../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';

export default function CarTypesPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Petrol' | 'Electric'>('All');
  const [mounted, setMounted] = useState(false);

  // Vehicle Types state
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [vtLoading, setVtLoading] = useState(true);

  // Engine Types state
  const [engineTypes, setEngineTypes] = useState<EngineType[]>([]);
  const [etLoading, setEtLoading] = useState(true);

  // Add Vehicle Type form
  const [carName, setCarName] = useState('');
  const [extraPrice, setExtraPrice] = useState('');
  const [sending, setSending] = useState(false);

  // Edit Vehicle Type state
  const [editingVt, setEditingVt] = useState<VehicleType | null>(null);
  const [editName, setEditName] = useState('');
  const [editExtraPrice, setEditExtraPrice] = useState('');

  // Edit Engine Type state
  const [editingEt, setEditingEt] = useState<EngineType | null>(null);
  const [editDiscount, setEditDiscount] = useState('');
  const [editEtDesc, setEditEtDesc] = useState('');

  const fetchAll = async () => {
    try {
      setVtLoading(true);
      setEtLoading(true);
      const [vts, ets] = await Promise.all([
        vehicleTypeService.list(),
        engineTypeService.list(),
      ]);
      setVehicleTypes(vts);
      setEngineTypes(ets);
    } catch {
      // handled
    } finally {
      setVtLoading(false);
      setEtLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAll();
  }, []);

  const filteredVts = vehicleTypes.filter(() => {
    if (activeTab === 'All') return true;
    return true; // engine-type filter is UI-only per option C
  });

  const handleAdd = async () => {
    if (!carName || !extraPrice) return;
    setSending(true);
    try {
      await vehicleTypeService.add({ name: carName, extra_price: extraPrice, is_active: true });
      setCarName('');
      setExtraPrice('');
      await fetchAll();
    } catch {
      // handled
    } finally {
      setSending(false);
    }
  };

  const handleClearForm = () => {
    setCarName('');
    setExtraPrice('');
  };

  const handleStartEditVt = (vt: VehicleType) => {
    setEditingVt(vt);
    setEditName(vt.name);
    setEditExtraPrice(String(vt.extraPrice));
  };

  const handleSaveEditVt = async () => {
    if (!editingVt) return;
    try {
      await vehicleTypeService.update(editingVt.id, {
        name: editName,
        extra_price: editExtraPrice,
      });
      setEditingVt(null);
      await fetchAll();
    } catch {
      // handled
    }
  };

  const handleDeleteVt = async (id: number) => {
    if (!confirm('Delete this vehicle type?')) return;
    try {
      await vehicleTypeService.remove(id);
      await fetchAll();
    } catch {
      // handled
    }
  };

  const handleStartEditEt = (et: EngineType) => {
    setEditingEt(et);
    setEditDiscount(String(et.discountPercent));
    setEditEtDesc(et.description);
  };

  const handleSaveEditEt = async () => {
    if (!editingEt) return;
    try {
      await engineTypeService.update(editingEt.id, {
        discount_percent: editDiscount,
        description: editEtDesc,
      });
      setEditingEt(null);
      await fetchAll();
    } catch {
      // handled
    }
  };

  const handleDeleteEt = async (id: number) => {
    if (!confirm('Delete this engine type?')) return;
    try {
      await engineTypeService.remove(id);
      await fetchAll();
    } catch {
      // handled
    }
  };

  if (!mounted || (vtLoading && etLoading)) {
    return <CarTypesLoadingSkeleton />;
  }

  return (
    <div className="space-y-8 w-full pb-12 animate-fade-in font-sans">

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
            Manage Car Types
          </h1>
          <p className="text-caption1 text-dark-200 font-semibold mt-3.5 leading-none">
            Create and manage vehicle categories with engine type and pricing.
          </p>
        </div>
      </div>

      {/* 2. Add New Car Type Form */}
      <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-h5-bold text-main-font tracking-tight">
            Add New Car Type
          </h3>
          <p className="text-caption1-bold text-dark-200 mt-1.5 leading-none uppercase tracking-wider">
            Create vehicle category
          </p>
        </div>

        <div className="space-y-6 w-full max-w-lg">
          <div className="space-y-2">
            <span className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
              Car Name
            </span>
            <input
              type="text"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              placeholder="e.g. Sedan, SUV"
              className="w-full h-[59px] px-6 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font placeholder-dark-200 focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-caption1-bold text-dark-200 uppercase tracking-wider">
              Extra Price
            </label>
            <input
              type="text"
              value={extraPrice}
              onChange={(e) => setExtraPrice(e.target.value)}
              placeholder="10.00"
              className="w-full h-[59px] px-6 text-sm font-extrabold rounded-full border-0 bg-dark-50/60 text-main-font placeholder-dark-200 focus:outline-none focus:ring-1 focus:ring-dark-300 transition-all"
            />
          </div>

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
              onClick={handleAdd}
              disabled={sending || !carName || !extraPrice}
              className="flex items-center justify-center w-[277px] h-[59px] bg-main-font hover:bg-main-font/90 text-white rounded-full text-sm font-bold transition-all shadow-md cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Adding...' : 'Add Car Type'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Existing Vehicle Types List */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-h5-bold text-main-font tracking-tight">
            Existing Car Types
          </h2>
        </div>

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

        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car Name</TableHead>
                <TableHead>Extra Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vtLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-dark-300">Loading...</TableCell></TableRow>
              ) : filteredVts.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-dark-300">No vehicle types found.</TableCell></TableRow>
              ) : (
                filteredVts.map((vt) => (
                  <TableRow key={vt.id}>
                    <TableCell className="font-black text-main-font">{vt.name}</TableCell>
                    <TableCell>
                      <span className="text-orange-300 font-bold mr-1">€</span>
                      <span className="text-main-font font-extrabold">{vt.extraPrice.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-caption1-bold tracking-wider border uppercase ${vt.isActive ? 'bg-[#E6F4EA]/60 text-[#137333] border-[#137333]/15' : 'bg-amber-50 text-amber-500 border-amber-100/30'}`}>
                        {vt.isActive ? 'Active' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleStartEditVt(vt)}
                          className="p-1.5 bg-dark-50 hover:bg-[#E9EBEF] text-[#5C5F66] rounded-[6px] border border-border/50 transition-all cursor-pointer inline-flex items-center justify-center shadow-sm active:scale-95"
                        >
                          <Icon icon="solar:pen-linear" className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVt(vt.id)}
                          className="p-1.5 bg-[#FFE6E6] hover:bg-[#FFD4D4] text-[#C5221F] rounded-[6px] border border-rose-200/30 transition-all cursor-pointer inline-flex items-center justify-center shadow-sm active:scale-95"
                        >
                          <Icon icon="solar:trash-bin-trash-linear" className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Vehicle Type Modal */}
      {editingVt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-[440px] shadow-2xl p-8 z-10 animate-scale-up space-y-6">
            <h3 className="text-xl font-bold text-[#2D2F33]">Edit Vehicle Type</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark-200 mb-1.5">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-[50px] px-5 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-dark-200 mb-1.5">Extra Price (€)</label>
                <input
                  type="text"
                  value={editExtraPrice}
                  onChange={(e) => setEditExtraPrice(e.target.value)}
                  className="w-full h-[50px] px-5 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setEditingVt(null)}
                className="flex-1 h-[46px] rounded-full bg-[#E9EBEF] hover:bg-[#DCE0E5] text-[#2D2F33] text-xs font-bold transition-all cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditVt}
                className="flex-1 h-[46px] rounded-full bg-main-font hover:bg-main-font/90 text-white text-xs font-bold transition-all cursor-pointer border-0"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Engine Types Management Section */}
      <div className="space-y-4 pt-8">
        <div>
          <h2 className="text-h5-bold text-main-font tracking-tight">
            Engine Types
          </h2>
          <p className="text-caption1 text-dark-200 font-semibold mt-1">
            Manage electric / petrol engine types and discounts.
          </p>
        </div>

        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Engine Type</TableHead>
                <TableHead>Discount %</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {etLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-dark-300">Loading...</TableCell></TableRow>
              ) : engineTypes.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-dark-300">No engine types found.</TableCell></TableRow>
              ) : (
                engineTypes.map((et) => (
                  <TableRow key={et.id}>
                    <TableCell className="font-black text-main-font capitalize">{et.engineType}</TableCell>
                    <TableCell className="font-extrabold text-main-font">{et.discountPercent}%</TableCell>
                    <TableCell className="text-dark-300">{et.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleStartEditEt(et)}
                          className="p-1.5 bg-dark-50 hover:bg-[#E9EBEF] text-[#5C5F66] rounded-[6px] border border-border/50 transition-all cursor-pointer inline-flex items-center justify-center shadow-sm active:scale-95"
                        >
                          <Icon icon="solar:pen-linear" className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEt(et.id)}
                          className="p-1.5 bg-[#FFE6E6] hover:bg-[#FFD4D4] text-[#C5221F] rounded-[6px] border border-rose-200/30 transition-all cursor-pointer inline-flex items-center justify-center shadow-sm active:scale-95"
                        >
                          <Icon icon="solar:trash-bin-trash-linear" className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Engine Type Modal */}
      {editingEt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-[440px] shadow-2xl p-8 z-10 animate-scale-up space-y-6">
            <h3 className="text-xl font-bold text-[#2D2F33]">Edit Engine Type</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark-200 mb-1.5">Discount %</label>
                <input
                  type="text"
                  value={editDiscount}
                  onChange={(e) => setEditDiscount(e.target.value)}
                  className="w-full h-[50px] px-5 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-dark-200 mb-1.5">Description</label>
                <input
                  type="text"
                  value={editEtDesc}
                  onChange={(e) => setEditEtDesc(e.target.value)}
                  className="w-full h-[50px] px-5 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setEditingEt(null)}
                className="flex-1 h-[46px] rounded-full bg-[#E9EBEF] hover:bg-[#DCE0E5] text-[#2D2F33] text-xs font-bold transition-all cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditEt}
                className="flex-1 h-[46px] rounded-full bg-main-font hover:bg-main-font/90 text-white text-xs font-bold transition-all cursor-pointer border-0"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
