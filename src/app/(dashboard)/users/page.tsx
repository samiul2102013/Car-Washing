'use strict';
'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { userService } from '../../../services';
import { API_BASE_URL } from '../../../constants/config';
import { User, UserStatus, ProviderDocument } from '../../../types';
import { exportPdf } from '../../../lib/exportPdf';
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
  const selectUser = async (id: string | null) => {
    setSelectedUserId(id);
    setIsDocVerifyOpen(false);
    setVerifyStep('list');
    setSelectedDocIndex(null);
    // Eagerly fetch documents for provider users
    if (id) {
      const user = users.find((u) => u.id === id);
      if (user?.role === 'provider') {
        try {
          const docs = await userService.getProviderDocuments(id);
          setProviderDocs(docs);
        } catch {
          setProviderDocs([]);
        }
      } else {
        setProviderDocs([]);
      }
    }
  };

  const [providerDocs, setProviderDocs] = useState<ProviderDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  const allDocsApproved = providerDocs.length > 0 && providerDocs.every((d) => d.status === 'approved');
  const anyDocsRejected = providerDocs.some((d) => d.status === 'rejected');

  // Load from API
  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setUsers([]);
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
      return matchesSearch && user.role === 'provider' && user.status !== 'pending';
    } else {
      return matchesSearch && user.role === 'provider' && user.status === 'pending';
    }
  });

  const selectedUser = users.find((u) => u.id === selectedUserId);

  // Toggle user block / suspension status
  const [actionError, setActionError] = useState<string | null>(null);
  const handleToggleSuspendUser = async (id: string, currentStatus: UserStatus) => {
    setActionError(null);
    try {
      setLoading(true);
      const nextStatus: UserStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
      await userService.updateUserStatus(id, nextStatus);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      setActionError('Could not update user status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAllDocuments = async () => {
    try {
      setDocsLoading(true);
      for (const doc of providerDocs) {
        if (doc.status !== 'approved') {
          await userService.reviewDocument(String(doc.id), 'approved', '');
        }
      }
      const freshDocs = await userService.getProviderDocuments(selectedUser!.id);
      setProviderDocs(freshDocs);
      setIsDocVerifyOpen(false);
    } catch {
      setIsDocVerifyOpen(false);
    } finally {
      setDocsLoading(false);
    }
  };

  const handleRejectAllDocuments = async () => {
    try {
      setDocsLoading(true);
      for (const doc of providerDocs) {
        if (doc.status !== 'rejected') {
          await userService.reviewDocument(String(doc.id), 'rejected', '');
        }
      }
      const freshDocs = await userService.getProviderDocuments(selectedUser!.id);
      setProviderDocs(freshDocs);
      setIsDocVerifyOpen(false);
    } catch {
      setIsDocVerifyOpen(false);
    } finally {
      setDocsLoading(false);
    }
  };

  const docUrl = (file: string) =>
    file.startsWith('http') ? file : `${API_BASE_URL}${file}`;

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
            onClick={() => exportPdf('users.pdf', 'Users Report', [
              { header: 'Name', dataKey: 'name' },
              { header: 'Email', dataKey: 'email' },
              { header: 'Role', dataKey: 'role' },
              { header: 'Status', dataKey: 'status' },
              { header: 'Phone', dataKey: 'phone' },
            ], filteredUsers.map((u) => ({
              name: u.name,
              email: u.email,
              role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
              status: u.status.charAt(0).toUpperCase() + u.status.slice(1),
              phone: u.phone,
            })))}
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

                    {/* Orders / Washes Column */}
                    <TableCell className="text-body2 font-semibold text-dark-300">
                      {user.orders ?? (user.role === 'provider' ? user.totalWashes : '-') ?? 0}
                    </TableCell>

                    {/* Total Spent / Earnings Column */}
                    <TableCell className="text-body2 text-right pr-12">
                      <span className="text-dark-200 font-normal mr-1.5">€</span>
                      <span className="text-main-font font-extrabold">{(user.totalSpent ?? 0).toFixed(2)}</span>
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

                {/* Stats card display */}
                {selectedUser.role !== 'admin' && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#F4F5F8] border border-slate-100/50 p-4.5 rounded-[24px] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 font-bold tracking-tight block">
                          {selectedUser.role === 'provider' ? 'Total Washes' : 'Total Orders'}
                        </span>
                        <span className="text-xl font-black text-[#2D2F33] mt-1 block">
                          {selectedUser.orders ?? selectedUser.totalWashes ?? 0}
                        </span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center">
                        <Icon icon="solar:bag-bold" className="w-5 h-5 text-yellow-500/80" />
                      </div>
                    </div>

                    <div className="bg-[#F4F5F8] border border-slate-100/50 p-4.5 rounded-[24px] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 font-bold tracking-tight block">
                          {selectedUser.role === 'provider' ? 'Total Earnings' : 'Total Spent'}
                        </span>
                        <span className="text-xl font-black text-[#2D2F33] mt-1 block">
                          <span className="text-[#FF8A48] mr-0.5">€</span>{(selectedUser.totalSpent ?? 0).toFixed(2)}
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
                    onClick={() => {
                      setIsDocVerifyOpen(true);
                      setVerifyStep('list');
                    }}
                    className="bg-[#F4F5F8] border border-slate-100 hover:border-slate-200 hover:bg-[#EBECF0] p-4 rounded-2xl flex items-center justify-between cursor-pointer w-full mt-4 transition-all duration-200 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF5EE] flex items-center justify-center shrink-0">
                          <Icon icon="solar:document-text-bold" className="w-5 h-5 text-orange-500" />
                        </div>
                        {/* Status dot */}
                        {providerDocs.length > 0 && (
                          <div className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center
                            ${allDocsApproved ? 'bg-green-500' : anyDocsRejected ? 'bg-red-500' : 'bg-amber-400'}
                          `}>
                            <Icon 
                              icon={allDocsApproved ? 'solar:check-bold' : anyDocsRejected ? 'solar:danger-bold' : 'solar:clock-circle-bold'} 
                              className="w-2.5 h-2.5 text-white" 
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-700 tracking-wider pl-1 select-none">
                          UPLOADED DOCUMENTS
                        </span>
                        {providerDocs.length > 0 && (
                          <span className={`text-[9px] font-bold pl-1 mt-0.5 select-none
                            ${allDocsApproved ? 'text-green-600' : anyDocsRejected ? 'text-red-500' : 'text-amber-600'}
                          `}>
                            {allDocsApproved ? 'All verified' : anyDocsRejected ? 'Issues found' : `${providerDocs.filter(d => d.status === 'pending').length} pending`}
                          </span>
                        )}
                      </div>
                    </div>
                    <Icon icon="solar:alt-arrow-right-linear" className="w-5 h-5 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Action error feedback */}
              {actionError && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
                  <Icon icon="solar:danger-bold" className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

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
                  disabled={loading}
                  className={`flex-1 h-[46px] rounded-full text-white text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/10 border-0 disabled:opacity-60 disabled:cursor-not-allowed
                    ${selectedUser.status === 'suspended'
                      ? 'bg-[#34A853] hover:bg-[#2B8E43]'
                      : 'bg-[#EA4335] hover:bg-[#D93025]'
                    }
                  `}
                >
                  <Icon icon="solar:shield-warning-linear" className="w-4 h-4 text-white" />
                  {loading ? 'Updating...' : selectedUser.status === 'suspended' ? 'Unblock' : 'Block'}
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
                  {docsLoading ? (
                    <div className="text-center py-8 text-xs font-bold text-slate-400">Loading documents...</div>
                  ) : providerDocs.length === 0 ? (
                    <div className="text-center py-8 text-xs font-bold text-slate-400">No documents found.</div>
                  ) : (
                    providerDocs.map((doc, idx) => (
                      <div 
                        key={doc.id}
                        onClick={() => { setSelectedDocIndex(idx); setVerifyStep('detail'); }}
                        className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm p-3.5 rounded-[22px] flex items-center justify-between cursor-pointer transition-all duration-200 active:scale-[0.99] gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-[64px] h-[44px] rounded-lg border border-slate-150 overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center select-none shadow-sm">
                            <Icon icon="solar:document-text-linear" className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-700 block select-none">
                              {doc.docType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </span>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 select-none
                              ${doc.status === 'approved' ? 'bg-[#E6F4EA] text-[#137333]' : ''}
                              ${doc.status === 'pending' ? 'bg-[#FFF9E6] text-[#B06000]' : ''}
                              ${doc.status === 'rejected' ? 'bg-[#FCE8E6] text-[#C5221F]' : ''}
                            `}>
                              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <Icon icon="solar:alt-arrow-right-linear" className="w-5 h-5 text-slate-450" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom Reject All / Approve All Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-3 mt-8">
                <button
                  onClick={handleRejectAllDocuments}
                  disabled={docsLoading}
                  className="flex-1 h-[46px] rounded-full bg-[#EA4335] hover:bg-[#D93025] text-white text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/10 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {docsLoading ? 'Rejecting...' : 'Reject All'}
                </button>
                <button
                  onClick={handleApproveAllDocuments}
                  disabled={docsLoading}
                  className="flex-1 h-[46px] rounded-full bg-[#34A853] hover:bg-[#2B8E43] text-white text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {docsLoading ? 'Approving...' : 'Approve All'}
                </button>
              </div>
            </div>
          )}

          {/* STAGE B: Centered Document Zoom Detail Preview Modal */}
          {verifyStep === 'detail' && selectedDocIndex !== null && providerDocs[selectedDocIndex] && (
            <div className="relative bg-white rounded-[32px] w-full max-w-[640px] shadow-2xl p-8 z-10 animate-scale-up space-y-6 flex flex-col justify-between max-h-[90vh] overflow-y-auto font-sans">
              {(() => {
                const doc = providerDocs[selectedDocIndex];
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#FFF5EE] flex items-center justify-center shrink-0 shadow-sm border border-orange-100/50">
                          <Icon icon="solar:document-text-bold" className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-800 leading-none">
                            {doc.docType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </h4>
                          <div className="flex items-center mt-1">
                            <span className="text-[10px] text-slate-400 font-medium leading-none select-none">
                              Submitted by: <span className="text-slate-500 font-semibold">{selectedUser.name}</span>
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ml-1.5 leading-none select-none
                              ${doc.status === 'approved' ? 'bg-[#E6F4EA] text-[#137333]' : ''}
                              ${doc.status === 'pending' ? 'bg-[#FFF9E6] text-[#B06000]' : ''}
                              ${doc.status === 'rejected' ? 'bg-[#FCE8E6] text-[#C5221F]' : ''}
                            `}>
                              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={docUrl(doc.file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-450 border border-slate-100 shadow-sm cursor-pointer transition-all active:scale-90 bg-white"
                        >
                          <Icon icon="solar:download-linear" className="w-4 h-4 text-slate-500" />
                        </a>
                        <button
                          onClick={() => setVerifyStep('list')}
                          className="w-8 h-8 rounded-full bg-[#E9EBEF] hover:bg-[#DCE0E5] text-[#5C5F66] flex items-center justify-center transition-all cursor-pointer border-0 shadow-sm active:scale-95"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-[#2D2F33]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="w-full aspect-[1.58] border border-slate-200/60 rounded-[24px] relative shadow-lg bg-slate-100 overflow-hidden flex items-center justify-center">
                      {doc.file ? (
                        <img
                          src={docUrl(doc.file)}
                          alt={doc.docType}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Icon icon="solar:document-text-linear" className="w-16 h-16 text-slate-300" />
                      )}
                    </div>

                    {doc.adminNote && (
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">Admin Note</span>
                        <p className="text-xs font-medium text-slate-700">{doc.adminNote}</p>
                      </div>
                    )}
                    {/* Back to list button */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => { setVerifyStep('list'); setSelectedDocIndex(null); }}
                        className="flex-1 h-[48px] rounded-full bg-[#E9EBEF] hover:bg-[#DCE0E5] text-[#2D2F33] text-xs font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border-0"
                      >
                        Back to Documents List
                      </button>
                    </div>
                  </>
                );
              })()}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
