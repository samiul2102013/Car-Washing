'use client';

import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}

export default function AuthLayout({ children, imageSrc, imageAlt }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 bg-white min-h-screen">
        <div className="hidden md:block relative bg-orange-100 overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent pointer-events-none" />
          <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/15 hover:bg-white/20 transition-all group z-10">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF8A48] to-[#FF4D4D] relative shrink-0 shadow-sm transition-transform group-hover:scale-105">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.5"/>
                <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 16C12.7355 16 13.3333 15.4022 13.3333 14.6667C13.3333 13.9311 12 12 12 12C12 12 10.6667 13.9311 10.6667 14.6667C10.6667 15.4022 11.2645 16 12 16Z" fill="white"/>
              </svg>
            </div>
            <span className="text-white text-xs font-black tracking-wider uppercase">Rince Admin</span>
          </Link>
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
