'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { Service } from '../../../types';
import { serviceConfigService } from '../../../services';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editService, setEditService] = useState<Service | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [sending, setSending] = useState(false);

  const loadServices = async () => {
    try {
      setServices(await serviceConfigService.getServices());
    } catch (e) {
      console.error(e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  if (loading) {
    return <ServicesLoadingSkeleton />;
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await serviceConfigService.deleteService(id);
      await loadServices();
    } catch (e) {
      console.error('Failed to delete service:', e);
    }
  };

  const handleOpenEdit = (s: Service) => {
    setEditService(s);
    setEditName(s.name);
    setEditDesc(s.description);
    setEditPrice(String(s.basePrice));
    setEditActive(s.isActive);
  };

  const handleSaveEdit = async () => {
    if (!editService) return;
    setSending(true);
    try {
      await serviceConfigService.updateService({
        id: editService.id,
        name: editName,
        description: editDesc,
        basePrice: parseFloat(editPrice) || 0,
        isActive: editActive,
      });
      setEditService(null);
      await loadServices();
    } catch (e) {
      console.error('Failed to update service:', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 animate-fade-in font-sans">

      {/* 1. Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div>
          <h1 className="text-h3 text-main-font tracking-tight leading-none">
            Services & Pricing
          </h1>
          <p className="text-caption1 text-dark-200 font-semibold mt-3.5 leading-none">
            Basic info like name, description, and image.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/car-types"
            className="flex items-center justify-center gap-2.5 w-[307px] h-[77px] rounded-full border border-[#B9B9B9] bg-dark-50 text-main-font text-sm font-black transition-all hover:bg-[#DCE0E5] shadow-sm cursor-pointer active:scale-95 select-none"
          >
            <Icon icon="solar:document-edit-linear" className="w-5 h-5 text-dark-300" />
            Manage Car Type
          </Link>

          <Link
            href="/services/create"
            className="flex items-center justify-center gap-2.5 w-[308px] h-[78px] rounded-full bg-main-font text-white text-sm font-black transition-all hover:bg-main-font/90 shadow-md cursor-pointer active:scale-95 select-none"
          >
            <Icon icon="solar:add-circle-linear" className="w-5.5 h-5.5" />
            Add Service
          </Link>
        </div>
      </div>

      {/* 3. Services Listing */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden p-0 max-w-[1730px] w-full">

        <div className="w-full h-[66px] bg-dark-50 flex items-center px-8 border-b border-border/50">
          <div className="grid grid-cols-12 w-full text-caption1-bold text-dark-300 uppercase tracking-widest items-center">
            <div className="col-span-5 pl-2">Services</div>
            <div className="col-span-3 text-left">Base Price</div>
            <div className="col-span-2 text-left pl-4">Status</div>
            <div className="col-span-2 text-center pr-2">Action</div>
          </div>
        </div>

        <div className="divide-y divide-border px-6">
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-12 w-full py-4 items-center px-2 hover:bg-dark-50/50 transition-colors duration-150 group"
              >
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-[75px] h-[58px] rounded-[5px] overflow-hidden border border-border/50 bg-dark-50 shadow-sm shrink-0 flex items-center justify-center p-1.5">
                    {service.image ? (
                      <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-full h-full text-dark-200" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z" />
                      </svg>
                    )}
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

                <div className="col-span-3 text-xs">
                  <span className="text-orange-300 font-black mr-1.5">€</span>
                  <span className="text-main-font font-black text-sm">{service.basePrice}</span>
                </div>

                <div className="col-span-2 text-left pl-4">
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-caption1-bold tracking-wider border uppercase ${service.isActive ? 'bg-[#E6FFEB] text-[#139615] border-[#139615]/15' : 'bg-amber-50 text-amber-500 border-amber-100/30'}`}>
                    {service.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>

                <div className="col-span-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="w-[52px] h-[52px] bg-dark-50 hover:bg-[#DCE0E5] text-main-font rounded-[8px] transition-all cursor-pointer flex items-center justify-center shadow-sm active:scale-95 shrink-0"
                  >
                    <Icon icon="solar:pen-linear" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="w-[52px] h-[52px] bg-[#FFE6E6] hover:bg-[#FFD4D4] text-[#961313] rounded-[8px] transition-all cursor-pointer flex items-center justify-center shadow-sm active:scale-95 shrink-0"
                  >
                    <Icon icon="solar:trash-bin-trash-linear" className="w-5 h-5" />
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="py-12 text-center text-dark-200 font-semibold">
              No services yet. Click "Add Service" to create one.
            </div>
          )}
        </div>

      </div>

      {/* Edit Service Modal */}
      {editService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white rounded-[32px] w-full max-w-[480px] shadow-2xl p-8 z-10 animate-scale-up space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#2D2F33]">Edit Service</h3>
              <button
                onClick={() => setEditService(null)}
                className="w-10 h-10 rounded-full bg-[#E9EBEF] hover:bg-[#DCE0E5] flex items-center justify-center cursor-pointer border-0"
              >
                <Icon icon="solar:close-linear" className="w-5 h-5 text-[#2D2F33]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark-200 mb-1.5">Service Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-[50px] px-5 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-200 mb-1.5">Description</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-dark-50/60 rounded-2xl p-5 text-sm font-semibold text-main-font border-0 focus:outline-none focus:ring-1 focus:ring-dark-300 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-200 mb-1.5">Base Price (€)</label>
                <input
                  type="text"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full h-[50px] px-5 text-sm font-semibold rounded-full border-0 bg-dark-50/60 text-main-font focus:outline-none focus:ring-1 focus:ring-dark-300"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-dark-200">Active</label>
                <button
                  onClick={() => setEditActive(!editActive)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${editActive ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${editActive ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setEditService(null)}
                className="flex-1 h-[46px] rounded-full bg-[#E9EBEF] hover:bg-[#DCE0E5] text-[#2D2F33] text-xs font-bold transition-all cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={sending}
                className="flex-1 h-[46px] rounded-full bg-main-font hover:bg-main-font/90 text-white text-xs font-bold transition-all cursor-pointer border-0 disabled:opacity-50"
              >
                {sending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

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
