'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import AuthLayout from '../../../components/auth/AuthLayout';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [activeInput, setActiveInput] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(59);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        prevInput?.focus();
        setActiveInput(index - 1);
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = code.join('');
    if (finalCode.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setError(null);
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setLoading(false);
    router.push('/auth/reset-password');
  };

  return (
    <AuthLayout
      imageSrc="/images/verify-email-car.png"
      imageAlt="Professional home cleaning service"
    >
      <div className="text-center md:text-left mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-main-font tracking-tight leading-tight">
          Verify Email
        </h1>
        <p className="text-lg text-subtitle mt-2 font-medium">
          We&apos;ve sent 6 digits code on your email
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
          <Label>Verify OTP</Label>

          <div className="grid grid-cols-6 gap-2 sm:gap-3.5 mt-3">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onFocus={() => setActiveInput(idx)}
                className={`w-full aspect-square text-center text-lg sm:text-xl font-medium rounded-2xl focus:outline-none transition-all duration-200 border-0 ${
                  activeInput === idx
                    ? 'bg-dark-50 text-main-font ring-2 ring-dark-100'
                    : 'bg-dark-50/70 text-main-font'
                }`}
                required
              />
            ))}
          </div>

          <div className="flex justify-end mt-4">
            {resendTimer > 0 ? (
              <span className="text-xs font-bold text-dark-200">
                Resend in <span className="font-mono">{resendTimer}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setResendTimer(59)}
                className="text-xs font-bold text-orange-300 hover:text-orange-600 transition-colors cursor-pointer"
              >
                Send again
              </button>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Icon icon="solar:spinner-linear" className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center md:text-left">
        <Link
          href="/auth/login"
          className="text-xs font-bold text-dark-200 hover:text-main-font transition-colors inline-flex items-center gap-1.5 group"
        >
          <Icon icon="solar:arrow-left-linear" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Cancel Verification
        </Link>
      </div>
    </AuthLayout>
  );
}
