'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import AuthLayout from '../../../components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setMessage('Verification code dispatched to your email.');
    setLoading(false);

    setTimeout(() => {
      router.push('/auth/verify-otp');
    }, 1000);
  };

  return (
    <AuthLayout
      imageSrc="/images/forgot-password-car.png"
      imageAlt="Man polishing car with orbital applicator"
    >
      <div className="text-center md:text-left mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-main-font tracking-tight leading-tight">
          Forgot Password
        </h1>
        <p className="text-lg text-subtitle mt-2 font-medium">
          Provide email address which you used to create account
        </p>
      </div>

      {message && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-green-50 border border-green-100 text-green-600 text-xs font-bold">
          <Icon icon="solar:check-circle-bold" className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..."
            icon={<Icon icon="solar:letter-linear" className="w-5 h-5" />}
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
              Sending...
            </>
          ) : (
            'Get Code'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center md:text-left">
        <Link
          href="/auth/login"
          className="text-xs font-bold text-dark-200 hover:text-main-font transition-colors inline-flex items-center gap-1.5 group"
        >
          <Icon icon="solar:arrow-left-linear" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Return to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
