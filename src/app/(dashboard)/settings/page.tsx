'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../../providers/AuthProvider';
import { authService } from '../../../services/auth/service';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'privacy' | 'terms'>('profile');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Profile forms
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Security forms
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Privacy / Terms text state
  const [privacyText, setPrivacyText] = useState('Admin write about disclaimer');
  const [termsText, setTermsText] = useState('Admin write about disclaimer');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch profile from API on mount to get latest data (phone, avatar, etc.)
  useEffect(() => {
    if (!mounted || !user) return;
    (async () => {
      try {
        const profile = await authService.getProfile();
        const nameParts = profile.fullName.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
        setProfileEmail(profile.email);
        setProfilePhone(profile.phone);
        if (profile.avatar) setAvatarPreview(profile.avatar);
      } catch {
        // fallback to context user
        setFirstName(user.name?.split(' ')[0] || '');
        setLastName(user.name?.split(' ').slice(1).join(' ') || '');
        setProfileEmail(user.email || '');
        setProfilePhone(user.phone || '');
      }
    })();
  }, [mounted, user]);

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      let profile;
      if (avatarFile) {
        profile = await authService.updateProfileWithAvatar({ full_name: fullName, email: profileEmail, phone: profilePhone, avatar: avatarFile });
        setAvatarFile(null);
      } else {
        profile = await authService.updateProfile({ full_name: fullName, email: profileEmail, phone: profilePhone });
      }
      updateUser({ name: profile.fullName, email: profile.email, phone: profile.phone, avatarUrl: profile.avatar });
      if (profile.avatar) setAvatarPreview(profile.avatar);
      setMessage('Profile updated successfully!');
    } catch {
      setMessage('Error: Failed to update profile.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Handle Password Change
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setMessage('Error: New passwords do not match.');
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setMessage('Error: Failed to update password.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Save privacy/terms
  const handleSaveText = async (type: 'privacy' | 'terms') => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setMessage(type === 'privacy' ? 'Privacy & Policy updated!' : 'Terms & Conditions updated!');
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  if (!mounted) return null;

  const tabs = [
    { key: 'profile', label: 'My Profile' },
    { key: 'security', label: 'Security' },
    { key: 'privacy', label: 'Privacy & Policy' },
    { key: 'terms', label: 'Terms & Conditions' },
  ] as const;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-h3 text-main-font tracking-tight leading-none">
          Settings
        </h1>
        <p className="text-body2 text-dark-200 mt-2">
          Manage your account & apps.
        </p>
      </div>

      {/* Success / Error banner */}
      {message && (
        <div
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium animate-accordion-down shadow-sm
          ${message.startsWith('Error:')
              ? 'bg-red-50 text-red-600'
              : 'bg-green-50 text-green-600'
            }
          `}
        >
          <Icon
            icon={message.startsWith('Error:') ? 'solar:danger-bold' : 'solar:check-circle-bold'}
            className="w-5 h-5 shrink-0"
          />
          <span>{message}</span>
        </div>
      )}

      {/* Horizontal Tabs */}
      <div className="flex gap-2 p-1 bg-dark-50 rounded-full w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap
              ${activeTab === tab.key
                ? 'bg-white text-orange-300 shadow-sm'
                : 'text-dark-200 hover:text-main-font'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-3xl p-8">
        {/* TAB 1: My Profile */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <label className="cursor-pointer block w-full h-full">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarFile(file);
                          setAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <img
                      src={avatarPreview || user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </label>
                </div>
                <label className="absolute bottom-1 right-1 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white shadow cursor-pointer">
                  <Icon icon="solar:pen-2-bold" className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatarFile(file);
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-main-font mb-2">First Name</label>
                  <div className="relative">
                    <Icon icon="solar:user-linear" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-200" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 text-sm rounded-full bg-dark-50 text-main-font placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-orange-300/20"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-main-font mb-2">Last Name</label>
                  <div className="relative">
                    <Icon icon="solar:user-linear" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-200" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 text-sm rounded-full bg-dark-50 text-main-font placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-orange-300/20"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-main-font mb-2">Phone Number</label>
                <div className="relative">
                  <Icon icon="solar:phone-linear" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-200" />
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-sm rounded-full bg-dark-50 text-main-font placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-orange-300/20"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-main-font hover:bg-main-font/90 text-white rounded-full text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer mt-4"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: Security */}
        {activeTab === 'security' && (
          <div className="animate-fade-in max-w-2xl mx-auto space-y-5">
            <div>
              <label className="block text-sm text-main-font mb-2">Current Password</label>
              <div className="relative">
                <Icon icon="solar:lock-password-linear" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-200" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="********"
                  className="w-full pl-12 pr-12 py-3 text-sm rounded-full bg-dark-50 text-main-font placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-orange-300/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-200 hover:text-main-font cursor-pointer"
                >
                  <Icon icon={showCurrent ? 'solar:eye-bold' : 'solar:eye-closed-bold'} className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-main-font mb-2">New Password</label>
              <div className="relative">
                <Icon icon="solar:lock-password-linear" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-200" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="********"
                  className="w-full pl-12 pr-12 py-3 text-sm rounded-full bg-dark-50 text-main-font placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-orange-300/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-200 hover:text-main-font cursor-pointer"
                >
                  <Icon icon={showNew ? 'solar:eye-bold' : 'solar:eye-closed-bold'} className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-main-font mb-2">Confirm Password</label>
              <div className="relative">
                <Icon icon="solar:lock-password-linear" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-200" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className="w-full pl-12 pr-12 py-3 text-sm rounded-full bg-dark-50 text-main-font placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-orange-300/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-200 hover:text-main-font cursor-pointer"
                >
                  <Icon icon={showConfirm ? 'solar:eye-bold' : 'solar:eye-closed-bold'} className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUpdatePassword}
              disabled={loading}
              className="w-full py-3.5 bg-main-font hover:bg-main-font/90 text-white rounded-full text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              Update Password
            </button>
          </div>
        )}

        {/* TAB 3: Privacy & Policy */}
        {activeTab === 'privacy' && (
          <div className="animate-fade-in space-y-4">
            {/* Toolbar */}
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <button className="p-1.5 hover:bg-dark-50 rounded text-main-font font-bold text-sm cursor-pointer" title="Bold">
                B
              </button>
              <button className="p-1.5 hover:bg-dark-50 rounded text-main-font italic text-sm cursor-pointer" title="Italic">
                I
              </button>
              <button className="p-1.5 hover:bg-dark-50 rounded text-main-font underline text-sm cursor-pointer" title="Underline">
                U
              </button>
              <div className="w-px h-5 bg-dark-50" />
              <button className="p-1.5 hover:bg-dark-50 rounded text-main-font text-sm cursor-pointer" title="Bullet list">
                <Icon icon="solar:list-bold" className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-dark-50 rounded text-main-font text-sm cursor-pointer" title="Numbered list">
                <Icon icon="solar:sort-by-time-bold" className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-dark-50 rounded text-main-font text-sm cursor-pointer" title="Text color">
                <Icon icon="solar:text-underline-bold" className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={privacyText}
              onChange={(e) => setPrivacyText(e.target.value)}
              rows={12}
              className="w-full px-2 py-3 text-sm text-main-font focus:outline-none resize-none"
            />

            <button
              type="button"
              onClick={() => handleSaveText('privacy')}
              disabled={loading}
              className="w-full py-3.5 bg-main-font hover:bg-main-font/90 text-white rounded-full text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              Update
            </button>
          </div>
        )}

        {/* TAB 4: Terms & Conditions */}
        {activeTab === 'terms' && (
          <div className="animate-fade-in space-y-4">
            {/* Toolbar */}
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <button className="p-1.5 hover:bg-dark-50 rounded text-main-font font-bold text-sm cursor-pointer" title="Bold">
                B
              </button>
              <button className="p-1.5 hover:bg-dark-50 rounded text-main-font italic text-sm cursor-pointer" title="Italic">
                I
              </button>
              <button className="p-1.5 hover:bg-dark-50 rounded text-main-font underline text-sm cursor-pointer" title="Underline">
                U
              </button>
              <div className="w-px h-5 bg-dark-50" />
              <button className="p-1.5 hover:bg-dark-50 rounded text-main-font text-sm cursor-pointer" title="Bullet list">
                <Icon icon="solar:list-bold" className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-dark-50 rounded text-main-font text-sm cursor-pointer" title="Numbered list">
                <Icon icon="solar:sort-by-time-bold" className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-dark-50 rounded text-main-font text-sm cursor-pointer" title="Text color">
                <Icon icon="solar:text-underline-bold" className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
              rows={12}
              className="w-full px-2 py-3 text-sm text-main-font focus:outline-none resize-none"
            />

            <button
              type="button"
              onClick={() => handleSaveText('terms')}
              disabled={loading}
              className="w-full py-3.5 bg-main-font hover:bg-main-font/90 text-white rounded-full text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
