'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import AuthLayout from '../../../components/auth/AuthLayout';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setSuccess('Password updated successfully! Redirecting...');
    setLoading(false);

    setTimeout(() => {
      router.push('/auth/login');
    }, 1500);
  };

  return (
    <AuthLayout
      imageSrc="/images/reset-password-car.png"
      imageAlt="Hand out car window road trip"
    >
      <div className="text-center md:text-left mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-main-font tracking-tight leading-tight">
          Create New Password
        </h1>
        <p className="text-lg text-subtitle mt-2 font-medium">
          You have to create a new password after forget
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-green-50 border border-green-100 text-green-600 text-xs font-bold">
          <Icon icon="solar:check-circle-bold" className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-xs font-bold">
          <Icon icon="solar:danger-bold" className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>New Password</Label>
          <Input
            type={showPass1 ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            icon={
              <button
                type="button"
                onClick={() => setShowPass1(!showPass1)}
                className="text-dark-200 hover:text-dark-300 transition-colors cursor-pointer"
              >
                <Icon icon={showPass1 ? 'solar:eye-linear' : 'solar:eye-closed-linear'} className="w-5 h-5" />
              </button>
            }
            iconPosition="right"
            required
          />
        </div>

        <div>
          <Label>Retype Password</Label>
          <Input
            type={showPass2 ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            icon={
              <button
                type="button"
                onClick={() => setShowPass2(!showPass2)}
                className="text-dark-200 hover:text-dark-300 transition-colors cursor-pointer"
              >
                <Icon icon={showPass2 ? 'solar:eye-linear' : 'solar:eye-closed-linear'} className="w-5 h-5" />
              </button>
            }
            iconPosition="right"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Icon icon="solar:spinner-linear" className="w-5 h-5 animate-spin" />
              Updating...
            </>
          ) : (
            'Update'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center md:text-left">
        <Link
          href="/auth/login"
          className="text-xs font-bold text-dark-200 hover:text-main-font transition-colors inline-flex items-center gap-1.5 group"
        >
          <Icon icon="solar:arrow-left-linear" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Cancel & Return
        </Link>
      </div>
    </AuthLayout>
  );
}
