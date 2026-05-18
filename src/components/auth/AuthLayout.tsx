'use client';

import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}

export default function AuthLayout({ children, imageSrc, imageAlt }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex flex-col justify-center">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-sm overflow-hidden md:min-h-[85vh]">
        <div className="hidden md:block relative bg-orange-100 rounded-xl m-3 overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent pointer-events-none" />
          <div className="absolute top-8 left-8 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/15">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-300 text-white text-[10px] font-black">
              C
            </div>
            <span className="text-white text-xs font-black tracking-wider">RINCE ADMIN</span>
          </div>
        </div>
        <div className="flex flex-col justify-center px-6 py-8 md:px-16 lg:px-20 bg-white">
          <div className="max-w-md w-full mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
