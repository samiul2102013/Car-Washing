'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { payoutService } from '../../../services';
import { Payout, PayoutStatus } from '../../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'Paid' | 'Pending' | 'Failed'>('all');
  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null);

  const loadPayouts = async () => {
    try {
      const data = await payoutService.getPayouts();
      setPayouts(data);
    } catch (err) {
      console.error('Failed to load payouts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayouts();
  }, []);

  const handleRetry = async (id: string) => {
    setRetryingId(id);
    try {
      await payoutService.retryPayout(id);
      await loadPayouts();
    } catch (err) {
      console.error('Failed to retry payout:', err);
    } finally {
      setRetryingId(null);
    }
  };

  if (loading) {
    return <PayoutsSkeleton />;
  }

  // Filter logic
  const displayPayouts = payouts.filter(p => {
    const matchesSearch = p.providerName.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const selectedPayout = payouts.find(p => p.id === selectedPayoutId) || payouts[0];

  return (
    <div className="space-y-6 w-full pb-8 animate-fade-in font-sans">
      
      {/* 1. Header Row (Figma text size, icons size, everything like given picture) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-main-font tracking-tight leading-none">
            Payouts
          </h1>
          <p className="text-caption1 text-dark-200 font-semibold mt-3.5 leading-none">
            Monitor and manage provider earnings distribution.
          </p>
        </div>

        {/* Header Action Buttons capsule style */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setLoading(true); loadPayouts(); }}
            className="flex items-center gap-2 h-[46px] px-6 bg-dark-50 hover:bg-dark-50/80 border border-border text-main-font rounded-full text-caption1-bold transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <Icon icon="solar:restart-linear" className={`w-4.5 h-4.5 text-subtitle-2 ${loading ? 'animate-spin' : ''}`} />
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

      {/* 2. Compact Horizontal Tab selection filter capsule */}
      <div className="flex bg-dark-50/65 p-1 rounded-full border border-border/40 w-fit shrink-0 select-none">
        <button
          onClick={() => { setActiveTab('all'); setSelectedPayoutId(null); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-caption1-bold transition-all cursor-pointer
            ${activeTab === 'all' 
              ? 'bg-white text-orange-300 shadow-sm border border-border/50' 
              : 'text-dark-300 hover:text-dark-300/80 bg-transparent border border-transparent'
            }
          `}
        >
          All
        </button>
        <button
          onClick={() => { setActiveTab('Paid'); setSelectedPayoutId(null); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-caption1-bold transition-all cursor-pointer
            ${activeTab === 'Paid' 
              ? 'bg-white text-orange-300 shadow-sm border border-border/50' 
              : 'text-dark-300 hover:text-dark-300/80 bg-transparent border border-transparent'
            }
          `}
        >
          Paid
        </button>
        <button
          onClick={() => { setActiveTab('Pending'); setSelectedPayoutId(null); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-caption1-bold transition-all cursor-pointer
            ${activeTab === 'Pending' 
              ? 'bg-white text-orange-300 shadow-sm border border-border/50' 
              : 'text-dark-300 hover:text-dark-300/80 bg-transparent border border-transparent'
            }
          `}
        >
          Pending
        </button>
        <button
          onClick={() => { setActiveTab('Failed'); setSelectedPayoutId(null); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-caption1-bold transition-all cursor-pointer
            ${activeTab === 'Failed' 
              ? 'bg-white text-orange-300 shadow-sm border border-border/50' 
              : 'text-dark-300 hover:text-dark-300/80 bg-transparent border border-transparent'
            }
          `}
        >
          Failed
        </button>
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden p-4">
        <Table className="min-w-[850px]">
          <TableHeader>
            <TableRow className="bg-transparent">
              <TableHead>Provider</TableHead>
              <TableHead>Gross Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Net Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayPayouts.length > 0 ? (
              displayPayouts.map((payout) => (
                <TableRow 
                  key={payout.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedPayoutId(payout.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-[42px] h-[42px] rounded-full overflow-hidden border border-border shadow-sm shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" 
                          alt={payout.providerName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-caption1-bold text-main-font leading-normal tracking-tight group-hover:text-orange-300 transition-colors">
                          {payout.providerName}
                        </span>
                        <span className="text-[9.5px] text-dark-200 tracking-tight leading-none mt-0.5">
                          {payout.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-dark-200 font-bold">
                    €{payout.amount}
                  </TableCell>

                  <TableCell className="font-bold text-[#FF5B5B]">
                    - €{Math.round(payout.amount * 0.2)}
                  </TableCell>

                  <TableCell>
                    <span className="text-orange-300 font-bold mr-1">€</span>
                    <span className="text-main-font font-black">{payout.amount}</span>
                  </TableCell>

                  <TableCell>
                    <span className={`inline-flex items-center px-4 py-0.5 rounded-full text-caption1-bold tracking-wider uppercase border
                      ${payout.status === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-500 border-emerald-100/30' 
                        : 'bg-rose-50 text-rose-500 border-rose-100/30'
                      }
                    `}>
                      {payout.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    {payout.status === 'Failed' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetry(payout.id);
                        }}
                        disabled={retryingId === payout.id}
                        className="p-2 rounded-lg border transition-all cursor-pointer inline-flex items-center justify-center shadow-sm active:scale-95 bg-rose-50 hover:bg-rose-50/80 text-rose-500 border-rose-200/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Icon icon="solar:restart-linear" className={`w-4.5 h-4.5 ${retryingId === payout.id ? 'animate-spin' : ''}`} />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPayoutId(payout.id);
                        }}
                        className="p-2 rounded-lg border transition-all cursor-pointer inline-flex items-center justify-center shadow-sm active:scale-95 bg-dark-50 hover:bg-dark-50/80 text-subtitle-2 border-border/60"
                      >
                        <Icon icon="solar:document-linear" className="w-4.5 h-4.5" />
                      </button>
                    )}
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-dark-200 font-semibold">
                  No payout distributions recorded.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedPayoutId && (
        <>
          <div 
            onClick={() => setSelectedPayoutId(null)}
            className="fixed inset-0 z-40 bg-main-font/20 backdrop-blur-sm transition-all duration-300"
          />
          
          <div className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white border-l border-border shadow-2xl p-8 overflow-y-auto animate-slide-in flex flex-col justify-between font-sans">
            
            <div className="space-y-6 flex-1 flex flex-col justify-between h-full">
              
              <div className="space-y-6">
                
                <div className="relative flex items-center justify-between pb-2">
                  <button
                    onClick={() => setSelectedPayoutId(null)}
                    className="w-10 h-10 rounded-full bg-dark-50 border border-border hover:bg-dark-50/80 text-subtitle-2 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                  >
                    <Icon icon="solar:arrow-left-linear" className="w-5 h-5 text-main-font" />
                  </button>

                  <div className="text-center flex-1">
                    <h3 className="text-[25px] font-black text-main-font tracking-tight leading-none">
                      Payout Details
                    </h3>
                    <span className="text-caption1 font-semibold text-dark-200 block mt-2">
                      Order #{selectedPayout.id}
                    </span>
                  </div>

                  <div className="w-10 h-10 invisible" /> {/* Spacer spacer */}
                </div>

                <div className="bg-main-font text-white rounded-xl p-6 shadow-xl relative overflow-hidden border border-main-font/20 space-y-4">
                  <div>
                    <span className="text-caption1-bold font-black text-dark-200 uppercase tracking-widest block mb-1.5">
                      SETTLEMENT PROCESSED
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-orange-300 text-[36px] font-extrabold">€</span>
                      <span className="text-white text-[48px] font-black tracking-tight leading-none">
                        670.00
                      </span>
                      <span className="text-dark-200 text-caption1 font-bold ml-1.5">
                        / net settled
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-main-font/40 my-2" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-caption1-bold font-black text-dark-200 uppercase tracking-wider block">
                        GROSS EARNINGS
                      </span>
                      <span className="text-[18px] font-black text-white block mt-1">
                        € 840.00
                      </span>
                    </div>
                    <div>
                      <span className="text-caption1-bold font-black text-dark-200 uppercase tracking-wider block">
                        COMMISSION (20%)
                      </span>
                      <span className="text-[18px] font-black text-[#FF5B5B] block mt-1">
                        - € 80.00
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-50 border border-border rounded-xl p-6 shadow-sm">
                  <div className="space-y-4 text-caption1 font-semibold">
                    
                    <div className="flex justify-between items-center py-1">
                      <span className="text-dark-300 font-bold">Provider Name</span>
                      <span className="text-main-font font-black">
                        {selectedPayout.providerName === 'Marc Wilson' ? 'Marcus Miller' : selectedPayout.providerName}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1">
                      <span className="text-dark-300 font-bold">Method</span>
                      <span className="text-main-font font-black">
                        Bank Transfer (*** 4421)
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1">
                      <span className="text-dark-300 font-bold">Processed On</span>
                      <span className="text-main-font font-black">
                        {selectedPayout.date}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1">
                      <span className="text-dark-300 font-bold">Status</span>
                      <span className={`inline-flex items-center px-4 py-0.5 rounded-full text-caption1-bold font-black tracking-wider uppercase border
                        ${selectedPayout.status === 'Paid' 
                          ? 'bg-emerald-50 text-emerald-500 border-emerald-100/30' 
                          : 'bg-rose-50 text-rose-500 border-rose-100/30'
                        }
                      `}>
                        {selectedPayout.status}
                      </span>
                    </div>

                  </div>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border select-none shrink-0">
                <button
                  onClick={() => setSelectedPayoutId(null)}
                  className="flex items-center justify-center gap-2 h-[46px] bg-dark-50 hover:bg-dark-50/80 text-main-font rounded-full text-caption1-bold font-black uppercase transition-all shadow-sm cursor-pointer active:scale-[0.98]"
                >
                  <Icon icon="solar:document-linear" className="w-4 h-4 text-main-font" />
                  View Receipt
                </button>
                
                <button
                  onClick={() => setSelectedPayoutId(null)}
                  className="flex items-center justify-center gap-2 h-[46px] bg-main-font hover:bg-main-font/90 text-white rounded-full text-caption1-bold font-black uppercase transition-all shadow-md cursor-pointer active:scale-[0.98]"
                >
                  <Icon icon="solar:file-download-linear" className="w-4 h-4 text-white" />
                  Invoice
                </button>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  );
}

function PayoutsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse w-full pb-8">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-dark-50 rounded-lg"></div>
        <div className="h-3 w-64 bg-dark-50 rounded-lg"></div>
      </div>
      <div className="h-10 w-64 bg-dark-50 rounded-full"></div>
      <div className="h-96 w-full bg-dark-50 rounded-3xl"></div>
    </div>
  );
}
