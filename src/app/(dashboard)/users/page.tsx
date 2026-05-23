'use strict';
'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { userService } from '../../../services';
import { User, UserStatus } from '../../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'customer' | 'provider' | 'pending'>('customer');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer states
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Centered Modal states
  const [isDocVerifyOpen, setIsDocVerifyOpen] = useState(false);
  const [verifyStep, setVerifyStep] = useState<'list' | 'detail'>('list');
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);

  // Helper to select/close user and reset modals
  const selectUser = (id: string | null) => {
    setSelectedUserId(id);
    setIsDocVerifyOpen(false);
    setVerifyStep('list');
    setSelectedDocIndex(null);
  };

  // High-fidelity mock users database matching the screenshots
  const defaultUsers: (User & { orders?: number; totalSpent?: number })[] = [
    {
      id: '#1001',
      name: 'Marc Wilson',
      email: 'marcwils@gmail.com',
      role: 'customer',
      status: 'active',
      phone: '+1 (555) 019-2831',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      createdAt: '2026-06-12T00:00:00Z',
      orders: 14,
      totalSpent: 250
    },
    {
      id: '#1002',
      name: 'Emilia Clarke',
      email: 'emilia@gmail.com',
      role: 'customer',
      status: 'active',
      phone: '+1 (555) 019-9988',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      createdAt: '2026-06-12T00:00:00Z',
      orders: 14,
      totalSpent: 250
    },
    {
      id: '#1003',
      name: 'Carlos Santana',
      email: 'carlos@santana.com',
      role: 'customer',
      status: 'active',
      phone: '+1 (555) 019-5566',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      createdAt: '2026-06-12T00:00:00Z',
      orders: 14,
      totalSpent: 250
    },
    {
      id: '#1004',
      name: 'Marcus Rashford',
      email: 'marcus@gmail.com',
      role: 'customer',
      status: 'suspended', // Blocked
      phone: '+1 (555) 019-2831',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      createdAt: '2026-06-12T00:00:00Z',
      orders: 14,
      totalSpent: 250
    },
    {
      id: '#1005',
      name: 'Selena Gomez',
      email: 'selena.g@gmail.com',
      role: 'customer',
      status: 'suspended', // Blocked
      phone: '+1 (555) 013-1100',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      createdAt: '2026-06-12T00:00:00Z',
      orders: 14,
      totalSpent: 250
    },
    // Providers Tab Mock
    {
      id: '#2001',
      name: 'Pam Beesly',
      email: 'pam.b@dundermifflin.com',
      role: 'provider',
      status: 'active',
      phone: '+1 (555) 887-2231',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      createdAt: '2025-10-12T00:00:00Z',
      orders: 12,
      totalSpent: 1120
    },
    // Pending Verification Tab Mock (Matches Screenshot 1, 2, 3)
    {
      id: '#3001',
      name: 'John Wick',
      email: 'wick.j@continental.com',
      role: 'provider',
      status: 'pending',
      phone: '+1 (555) 887-2231',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      createdAt: '2026-05-18T00:00:00Z',
      orders: 12,
      totalSpent: 1120
    }
  ];

  // Document Checklist dataset matching Screenshot 2
  const mockDocuments = [
    { name: 'Government Card', status: 'Verified' },
    { name: 'NID Card', status: 'Verified' },
    { name: 'Siret Certificate', status: 'Pending' },
    { name: 'Siret Certificate', status: 'Pending' },
    { name: 'Insurance Policy', status: 'Rejected' }
  ];

  // Load database
  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        setUsers(defaultUsers as User[]);
      }
    } catch (err) {
      console.error('Failed to load users, using mock data:', err);
      setUsers(defaultUsers as User[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter list by selected tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    if (activeTab === 'customer') {
      return matchesSearch && user.role === 'customer';
    } else if (activeTab === 'provider') {
      return matchesSearch && user.role === 'provider' && user.status === 'active';
    } else {
      return matchesSearch && user.role === 'provider' && user.status === 'pending';
    }
  });

  const selectedUser = users.find((u) => u.id === selectedUserId) as (User & { orders?: number; totalSpent?: number }) | undefined;

  // Toggle user block / suspension status
  const handleToggleSuspendUser = async (id: string, currentStatus: UserStatus) => {
    try {
      setLoading(true);
      const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
      await userService.updateUserStatus(id, nextStatus);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      // Fallback local update
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: currentStatus === 'suspended' ? 'active' : 'suspended' } : u));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8 animate-fade-in font-sans">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-main-font tracking-tight leading-none">
            Users
          </h1>
          <p className="text-caption1 text-dark-200 font-medium mt-2">
            Control user accounts, approvals, and activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setLoading(true); fetchUsers(); }}
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

      {/* 2. Controls & Tabs Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white border border-border/50 p-4 rounded-3xl shadow-sm">
        
        {/* Tab Selection Capsule */}
        <div className="flex bg-dark-50/80 p-1 rounded-full border border-border/40 w-fit shrink-0">
          <button
            onClick={() => { setActiveTab('customer'); selectUser(null); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-caption1-bold transition-all cursor-pointer
              ${activeTab === 'customer' 
                ? 'bg-orange-50 text-orange-300 border border-orange-100/50 shadow-sm' 
                : 'text-dark-300 hover:text-dark-300/80 bg-transparent border border-transparent'
              }
            `}
          >
            <Icon icon="solar:users-group-two-rounded-linear" className="w-4 h-4" />
            Customer
          </button>
          <button
            onClick={() => { setActiveTab('provider'); selectUser(null); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-caption1-bold transition-all cursor-pointer
              ${activeTab === 'provider' 
                ? 'bg-orange-50 text-orange-300 border border-orange-100/50 shadow-sm' 
                : 'text-dark-300 hover:text-dark-300/80 bg-transparent border border-transparent'
              }
            `}
          >
            <Icon icon="solar:shield-user-linear" className="w-4 h-4" />
            Provider
          </button>
          <button
            onClick={() => { setActiveTab('pending'); selectUser(null); }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-caption1-bold transition-all relative cursor-pointer
              ${activeTab === 'pending' 
                ? 'bg-orange-50 text-orange-300 border border-orange-100/50 shadow-sm' 
                : 'text-dark-300 hover:text-dark-300/80 bg-transparent border border-transparent'
              }
            `}
          >
            <Icon icon="solar:document-linear" className="w-4 h-4" />
            Pending
            {users.some(u => u.status === 'pending') && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-white animate-ping" />
            )}
          </button>
        </div>

        {/* Search Input Box */}
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

      {/* 3. Table Directory Listing */}
      <div className="bg-white border border-border/50 rounded-3xl shadow-sm overflow-hidden p-2">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="bg-dark-50/80">
                <TableHead className="rounded-l-2xl pl-4 w-[280px]">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="text-right pr-12">Total Spent</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-center rounded-r-2xl">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id}
                    className="cursor-pointer"
                    onClick={() => selectUser(user.id)}
                  >
                    {/* User Profile Column */}
                    <TableCell className="pl-4 w-[280px]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-border shadow-sm shrink-0">
                          <img 
                            src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60'} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-body2-bold text-main-font leading-normal tracking-tight group-hover:text-orange-300 transition-colors">
                            {user.name}
                          </span>
                          <span className="text-caption1 text-dark-200 tracking-tight leading-none mt-0.5">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-caption1-bold border
                        ${user.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-500 border-emerald-100/30' 
                          : user.status === 'suspended' 
                          ? 'bg-red-50 text-red-500 border-red-100/30' 
                          : 'bg-amber-50 text-amber-500 border-amber-100/30'
                        }
                      `}>
                        {user.status === 'suspended' ? 'Blocked' : user.status === 'active' ? 'Active' : 'Pending'}
                      </span>
                    </TableCell>

                    {/* Orders Column */}
                    <TableCell className="text-body2 font-semibold text-dark-300">
                      {(user as any).orders ?? 14}
                    </TableCell>

                    {/* Total Spent Column */}
                    <TableCell className="text-body2 text-right pr-12">
                      <span className="text-dark-200 font-normal mr-1.5">€</span>
                      <span className="text-main-font font-extrabold">{(user as any).totalSpent ?? 250}</span>
                    </TableCell>

                    {/* Joined Date Column */}
                    <TableCell className="text-body2 font-semibold text-dark-300">
                      {new Date(user.createdAt).toLocaleDateString('en-GB')}
                    </TableCell>

                    {/* Action Eye Button */}
                    <TableCell className="text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectUser(user.id);
                        }}
                        className="p-1.5 bg-dark-50 hover:bg-dark-100 text-dark-300 rounded-lg border border-border transition-all cursor-pointer inline-flex items-center justify-center shadow-sm active:scale-95"
                      >
                        <Icon icon="solar:eye-linear" className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-dark-200 font-semibold text-body2">
                    No users matching search filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 4. Sliding Profile Details Drawer */}
      {selectedUser && (
        <>
          {/* Drawer Overlay Backdrop */}
          <div 
            onClick={() => selectUser(null)}
            className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm transition-all duration-300"
          />
          
          {/* Sliding Sheet Drawer container */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white border-l border-slate-100 shadow-2xl p-8 overflow-y-auto animate-slide-in flex flex-col justify-between font-sans">
            
            <div className="space-y-6 flex-1 flex flex-col justify-between h-full">
              <div className="space-y-6">
                {/* Close Button Row */}
                <div className="flex justify-end">
                  <button
                    onClick={() => selectUser(null)}
                    className="w-9 h-9 rounded-full bg-[#E9EBEF] hover:bg-[#DCE0E5] text-[#5C5F66] flex items-center justify-center transition-all cursor-pointer border-0 shadow-sm active:scale-95"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={2.5} 
                      stroke="currentColor" 
                      className="w-4 h-4 text-[#2D2F33]"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Centered Large Profile Card Block */}
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full mx-auto border-2 border-slate-100 shadow-md relative">
                    <img 
                      src={selectedUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                      alt={selectedUser.name} 
                      className="w-full h-full object-cover rounded-full" 
                    />
                    {/* active marker status */}
                    {selectedUser.status === 'active' && (
                      <span className="absolute bottom-0 right-1.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#2D2F33] mt-4 leading-none">
                    {selectedUser.name}
                  </h3>
                  
                  {/* Role Pill Container */}
                  <div className={`text-[11px] font-bold px-3.5 py-1 rounded-full w-fit mx-auto mt-2 border
                    ${selectedUser.status === 'pending'
                      ? 'bg-[#FFF9E6] text-[#B06000] border-amber-100/50'
                      : 'bg-[#FFF5EE] text-[#FF8A48] border-[#FEF0E6]'
                    }
                  `}>
                    {selectedUser.status === 'pending' ? 'Pending' : selectedUser.role === 'provider' ? 'Provider' : 'Customer'}
                  </div>
                </div>

                {/* Stats card display only for CUSTOMER */}
                {selectedUser.role === 'customer' && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {/* Total Orders Card */}
                    <div className="bg-[#F4F5F8] border border-slate-100/50 p-4.5 rounded-[24px] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 font-bold tracking-tight block">Total Order</span>
                        <span className="text-xl font-black text-[#2D2F33] mt-1 block">
                          {selectedUser.orders ?? 12}
                        </span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center">
                        <Icon icon="solar:bag-bold" className="w-5 h-5 text-yellow-500/80" />
                      </div>
                    </div>

                    {/* Total Spent Card */}
                    <div className="bg-[#F4F5F8] border border-slate-100/50 p-4.5 rounded-[24px] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 font-bold tracking-tight block">Total Spent</span>
                        <span className="text-xl font-black text-[#2D2F33] mt-1 block">
                          <span className="text-[#FF8A48] mr-0.5">€</span>{selectedUser.totalSpent ?? '1,120'}
                        </span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Icon icon="solar:wallet-money-bold" className="w-5 h-5 text-emerald-500/80" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Personal Info section */}
                <div className="space-y-3.5">
                  <h4 className="text-sm font-bold text-[#2D2F33]">
                    Personal Info
                  </h4>

                  {/* Email capsule */}
                  <div className="bg-[#F4F5F8] border border-slate-100 rounded-full h-[46px] flex items-center px-4 w-full">
                    <Icon icon="solar:letter-linear" className="w-4 h-4 text-slate-450 shrink-0" />
                    <input 
                      type="email" 
                      readOnly
                      value={selectedUser.email}
                      className="text-xs font-semibold text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-0 w-full pl-2.5"
                      placeholder="Enter your email..."
                    />
                  </div>

                  {/* Phone Number capsule */}
                  <div className="bg-[#F4F5F8] border border-slate-100 rounded-full h-[46px] flex items-center px-4 w-full">
                    <Icon icon="solar:phone-linear" className="w-4 h-4 text-slate-450 shrink-0" />
                    <input 
                      type="text" 
                      readOnly
                      value={selectedUser.phone}
                      className="text-xs font-semibold text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-0 w-full pl-2.5"
                      placeholder="Enter your phone number..."
                    />
                  </div>

                  {/* Address capsule */}
                  <div className="bg-[#F4F5F8] border border-slate-100 rounded-full h-[46px] flex items-center px-4 w-full">
                    <Icon icon="solar:map-point-linear" className="w-4 h-4 text-slate-450 shrink-0" />
                    <input 
                      type="text" 
                      readOnly
                      value={selectedUser.role === 'provider' ? 'Mission District, San Francisco' : 'Main St, San Francisco, CA 94103'}
                      className="text-xs font-semibold text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-0 w-full pl-2.5"
                      placeholder="Enter your Address..."
                    />
                  </div>
                </div>

                {/* UPLOADED DOCUMENTS trigger card row for PROVIDER (Screenshot 1) */}
                {selectedUser.role === 'provider' && (
                  <div 
                    onClick={() => { setIsDocVerifyOpen(true); setVerifyStep('list'); }}
                    className="bg-[#F4F5F8] border border-slate-100 hover:border-slate-200 hover:bg-[#EBECF0] p-4 rounded-2xl flex items-center justify-between cursor-pointer w-full mt-4 transition-all duration-200 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF5EE] flex items-center justify-center shrink-0">
                        <Icon icon="solar:document-text-bold" className="w-5 h-5 text-orange-500" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 tracking-wider pl-1 select-none">
                        UPLOADED DOCUMENTS
                      </span>
                    </div>
                    <Icon icon="solar:alt-arrow-right-linear" className="w-5 h-5 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Bottom Actions Footer */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-3 mt-8">
                <button
                  className="flex-1 h-[46px] rounded-full bg-[#E9EBEF] hover:bg-[#DCE0E5] text-[#2D2F33] text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border-0"
                >
                  <Icon icon="solar:pen-linear" className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={() => handleToggleSuspendUser(selectedUser.id, selectedUser.status)}
                  className={`flex-1 h-[46px] rounded-full text-white text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/10 border-0
                    ${selectedUser.status === 'suspended'
                      ? 'bg-[#34A853] hover:bg-[#2B8E43]'
                      : 'bg-[#EA4335] hover:bg-[#D93025]'
                    }
                  `}
                >
                  <Icon icon="solar:shield-warning-linear" className="w-4 h-4 text-white" />
                  {selectedUser.status === 'suspended' ? 'Unblock' : 'Block'}
                </button>
              </div>
            </div>

          </div>
        </>
      )}

      {/* 5. DUAL-STAGE CENTERED DOCUMENT VERIFICATION MODALS CONTAINER */}
      {isDocVerifyOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          {/* Backdrop close listener */}
          <div 
            onClick={() => setIsDocVerifyOpen(false)}
            className="absolute inset-0 cursor-pointer"
          />
          
          {/* STAGE A: Centered Documents Checklist Modal (Screenshot 2) */}
          {verifyStep === 'list' && (
            <div className="relative bg-white rounded-[32px] w-full max-w-[440px] shadow-2xl p-8 z-10 animate-scale-up space-y-6 flex flex-col justify-between max-h-[90vh] overflow-y-auto font-sans">
              <div>
                {/* Documents Header with Back Arrow Button */}
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsDocVerifyOpen(false)}
                    className="w-9 h-9 bg-[#E9EBEF] hover:bg-[#DCE0E5] rounded-full flex items-center justify-center cursor-pointer transition-all border-0 shadow-sm active:scale-95 shrink-0"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={2.5} 
                      stroke="currentColor" 
                      className="w-4 h-4 text-[#2D2F33]"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  
                  <h3 className="text-xl font-bold text-[#2D2F33] w-full text-center pr-9">
                    Documents
                  </h3>
                </div>

                {/* Documents list rows */}
                <div className="space-y-3.5 mt-6">
                  {mockDocuments.map((doc, idx) => (
                    <div 
                      key={idx}
                      onClick={() => { setSelectedDocIndex(idx); setVerifyStep('detail'); }}
                      className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm p-3.5 rounded-[22px] flex items-center justify-between cursor-pointer transition-all duration-200 active:scale-[0.99] gap-3"
                    >
                      <div className="flex items-center gap-3">
                        {/* High-fidelity CSS French Identity Card miniature preview thumbnail (Screenshot 2) */}
                        <div className="w-[64px] h-[44px] rounded-lg border border-slate-150 overflow-hidden shrink-0 bg-[#EBF3FB] relative p-0.5 flex flex-col justify-between select-none shadow-sm shrink-0">
                          {/* Miniature top blue bar banner */}
                          <div className="w-full h-[4px] bg-sky-900/10 rounded-sm" />
                          <div className="flex gap-1 items-center flex-1 pt-0.5">
                            {/* Grayscale face miniature */}
                            <div className="w-3.5 h-4.5 bg-slate-350 rounded-sm shrink-0" />
                            {/* Mimicked miniature CNI text lines */}
                            <div className="flex-1 space-y-0.5">
                              <div className="w-6 h-[2px] bg-slate-300 rounded-sm" />
                              <div className="w-4 h-[2px] bg-slate-300 rounded-sm" />
                              <div className="w-5 h-[2px] bg-slate-300 rounded-sm" />
                            </div>
                          </div>
                          <div className="w-2 h-[2px] bg-orange-450/40 self-end mr-1" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-700 block select-none">
                            {doc.name}
                          </span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 select-none
                            ${doc.status === 'Verified' ? 'bg-[#E6F4EA] text-[#137333]' : ''}
                            ${doc.status === 'Pending' ? 'bg-[#FFF9E6] text-[#B06000]' : ''}
                            ${doc.status === 'Rejected' ? 'bg-[#FCE8E6] text-[#C5221F]' : ''}
                          `}>
                            {doc.status}
                          </span>
                        </div>
                      </div>
                      <Icon icon="solar:alt-arrow-right-linear" className="w-5 h-5 text-slate-450" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Reject / Approve Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-3 mt-8">
                <button
                  onClick={() => { alert('Provider applications rejected.'); setIsDocVerifyOpen(false); }}
                  className="flex-1 h-[46px] rounded-full bg-[#EA4335] hover:bg-[#D93025] text-white text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/10 border-0"
                >
                  Reject
                </button>
                <button
                  onClick={() => { alert('Provider applications approved successfully.'); setIsDocVerifyOpen(false); }}
                  className="flex-1 h-[46px] rounded-full bg-[#34A853] hover:bg-[#2B8E43] text-white text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10 border-0"
                >
                  Approve
                </button>
              </div>
            </div>
          )}

          {/* STAGE B: Centered Document Zoom Detail Preview Modal (Screenshot 3) */}
          {verifyStep === 'detail' && selectedDocIndex !== null && (
            <div className="relative bg-white rounded-[32px] w-full max-w-[640px] shadow-2xl p-8 z-10 animate-scale-up space-y-6 flex flex-col justify-between max-h-[90vh] overflow-y-auto font-sans">
              
              {/* Top Zoom View Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Document sheet orange icon */}
                  <div className="w-11 h-11 rounded-2xl bg-[#FFF5EE] flex items-center justify-center shrink-0 shadow-sm border border-orange-100/50">
                    <Icon icon="solar:document-text-bold" className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 leading-none">
                      {mockDocuments[selectedDocIndex].name}
                    </h4>
                    <div className="flex items-center mt-1">
                      <span className="text-[10px] text-slate-400 font-medium leading-none select-none">
                        Submitted by: <span className="text-slate-500 font-semibold">{selectedUser.name}</span>
                      </span>
                      <span className="bg-[#E6F4EA] text-[#137333] text-[9px] px-2 py-0.5 rounded-full font-bold ml-1.5 leading-none select-none">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-450 border border-slate-100 shadow-sm cursor-pointer transition-all active:scale-90 bg-white">
                    <Icon icon="solar:download-linear" className="w-4 h-4 text-slate-500" />
                  </button>
                  <button className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-450 border border-slate-100 shadow-sm cursor-pointer transition-all active:scale-90 bg-white">
                    <Icon icon="solar:magnifer-plus-linear" className="w-4 h-4 text-slate-500" />
                  </button>
                  {/* Close button to dismiss and return to stage A */}
                  <button
                    onClick={() => setVerifyStep('list')}
                    className="w-8 h-8 rounded-full bg-[#E9EBEF] hover:bg-[#DCE0E5] text-[#5C5F66] flex items-center justify-center transition-all cursor-pointer border-0 shadow-sm active:scale-95"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={2.5} 
                      stroke="currentColor" 
                      className="w-3.5 h-3.5 text-[#2D2F33]"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Gorgeous HTML/CSS replica of the French identity card (Screenshot 3) */}
              <div className="w-full aspect-[1.58] border border-slate-200/60 rounded-[24px] relative shadow-lg bg-[#EBF3FB] overflow-hidden select-none">
                
                {/* Security Micro lines guilloche background watermark */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1c_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#ffffff1c_10%,transparent_70%)] pointer-events-none" />

                {/* Watermark large "RF" block */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span className="text-[170px] font-black text-orange-400/[0.04] leading-none tracking-tighter select-none">RF</span>
                </div>

                {/* Top Header blue-grey banner block */}
                <div className="w-full h-[18%] bg-sky-900/10 flex items-center justify-between px-4.5 border-b border-sky-900/10">
                  <div className="flex items-center gap-2">
                    {/* Medallion silhouette circular icon */}
                    <div className="w-[26px] h-[26px] rounded-full bg-slate-400 overflow-hidden shrink-0 border border-slate-300 relative flex items-center justify-center shadow-inner">
                      <span className="text-[10px] text-white font-black select-none leading-none">M</span>
                    </div>
                    <div>
                      <h5 className="text-[9px] font-black tracking-wide text-sky-900 leading-none">RÉPUBLIQUE FRANÇAISE</h5>
                      <span className="text-[6.5px] text-sky-850 font-bold block mt-0.5 select-none leading-none">MINISTÈRE DE L'INTÉRIEUR</span>
                    </div>
                  </div>
                  <div className="text-right font-sans">
                    <span className="text-[7.5px] font-extrabold text-sky-900 block leading-none">CARTE NATIONALE D'IDENTITÉ / IDENTITY CARD</span>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span className="text-[5.5px] text-slate-500 font-bold leading-none">FR</span>
                      {/* Star seal emblem */}
                      <div className="w-[11px] h-[11px] rounded-full bg-gradient-to-tr from-yellow-500 to-yellow-300 border border-yellow-450 flex items-center justify-center select-none shadow-sm shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Left Grayscale Photo Slot */}
                <div className="w-[24%] h-[68%] absolute bottom-[7%] left-[5%] rounded-2xl border-2 border-white shadow-md overflow-hidden bg-slate-200 shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
                    alt="grayscale verified ID card portrait" 
                    className="w-full h-full object-cover grayscale opacity-90 contrast-125 brightness-95" 
                  />
                </div>

                {/* CNI details on the right */}
                <div className="absolute left-[33%] top-[24%] w-[63%] text-[8px] font-bold text-slate-800 space-y-1 leading-relaxed">
                  <p className="leading-none"><span className="text-slate-400 font-medium">NOM / Surname:</span> <span className="font-extrabold text-slate-900 text-[10px]">MARTIN</span></p>
                  <p className="leading-none"><span className="text-slate-400 font-medium">Prénoms / Given names:</span> <span className="font-semibold text-slate-900 text-[8.5px]">Maëlys-Gaëlle, Marie</span></p>
                  <div className="grid grid-cols-3 gap-1 pt-0.5 leading-none">
                    <p><span className="text-slate-400 font-medium">SEXE / Sex:</span> <span className="text-slate-900 font-black">F</span></p>
                    <p className="col-span-2"><span className="text-slate-400 font-medium">NATIONALITÉ / Nationality:</span> <span className="text-slate-900 font-bold">FRA</span></p>
                  </div>
                  <p className="leading-none"><span className="text-slate-400 font-medium">DATE DE NAISS / DOB:</span> <span className="text-slate-900 font-bold">13 07 1990</span></p>
                  <p className="leading-none"><span className="text-slate-400 font-medium">LIEU DE NAISS / POB:</span> <span className="text-slate-900 font-semibold">PARIS (75)</span></p>
                  <p className="leading-none"><span className="text-slate-400 font-medium">NOM D'USAGE / Alternate:</span> <span className="text-slate-850">NOM D'USAGE</span></p>
                  
                  <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-slate-350/30 leading-none">
                    <p><span className="text-slate-400 font-medium">N° DOC / Doc No:</span> <span className="text-slate-900 font-mono font-bold text-[8.5px]">X4RTBPFW4</span></p>
                    <p className="text-right pr-3"><span className="text-slate-400 font-medium">EXPIR / Expiry:</span> <span className="text-slate-900 font-bold">11 02 2030</span></p>
                  </div>
                </div>

                {/* Ink Cursive Signature in the bottom-right corner */}
                <div className="absolute right-[8%] bottom-[9%] w-[35%] h-[18%] flex flex-col justify-end text-right select-none opacity-90 pointer-events-none">
                  <span className="font-serif italic text-[11px] text-[#00008B] font-semibold leading-none block -rotate-3 pr-3">
                    M.Martin
                  </span>
                </div>

              </div>

              {/* Bottom Reject / Approve Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => { alert('Document Rejected.'); setVerifyStep('list'); }}
                  className="flex-1 h-[48px] rounded-full bg-[#EA4335] hover:bg-[#D93025] text-white text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/10 border-0"
                >
                  Reject
                </button>
                <button
                  onClick={() => { alert('Document Approved successfully.'); setVerifyStep('list'); }}
                  className="flex-1 h-[48px] rounded-full bg-[#34A853] hover:bg-[#2B8E43] text-white text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10 border-0"
                >
                  Approve
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
