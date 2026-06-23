'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useAuth } from '../../../providers/AuthProvider';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import AuthLayout from '../../../components/auth/AuthLayout';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid admin credentials. Please try again.');
      }
    } catch (err) {
      console.error('[login page] login() threw:', err);
      setError('Authentication failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      imageSrc="/images/login-car.png"
      imageAlt="Sports car being serviced"
    >
      <div className="text-center md:text-left mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-main-font tracking-tight leading-tight">
          Sign In
        </h1>
        <p className="text-lg text-subtitle mt-2 font-medium">
          Access your account with correct information
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-xs font-bold">
          <Icon icon="solar:danger-bold" className="w-5 h-5 shrink-0" />
          <span>{error}</span>
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

        <div>
          <Label>Password</Label>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            icon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-dark-200 hover:text-dark-300 transition-colors cursor-pointer"
              >
                <Icon icon={showPassword ? 'solar:eye-linear' : 'solar:eye-closed-linear'} className="w-5 h-5" />
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
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
