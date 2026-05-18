'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([
    { id: '1', customer: 'Azhar R.', service: 'Express Wash', rating: 5, comment: 'Amazing service! Fast and extremely convenient.', date: 'Today' },
    { id: '2', customer: 'Azhar R.', service: 'Standard Wash', rating: 4, comment: 'Very clean car. Good provider, was on time.', date: 'Yesterday' },
    { id: '3', customer: 'Azhar R.', service: 'Premium Wash', rating: 5, comment: 'Spectacular detailing on my SUV, worth every penny.', date: '3 days ago' },
  ]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      
      {/* Header */}
      <div>
        <h1 className="text-h3 text-main-font tracking-tight leading-none">
          Reviews Ledger
        </h1>
        <p className="text-caption1 text-dark-200 font-semibold mt-1.5">
          Monitor provider performance and customer feedback reviews.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm flex flex-col justify-between h-30">
          <span className="text-caption1-bold text-dark-200 uppercase tracking-wider block">Average Star Rating</span>
          <div>
            <span className="text-h4-bold text-main-font block tracking-tight">4.8</span>
            <div className="flex items-center gap-1 mt-1 text-emerald-500 font-bold text-[10px]">
              <Icon icon="solar:star-bold" className="w-3.5 h-3.5" />
              <span>Outstanding Performance</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm flex flex-col justify-between h-30">
          <span className="text-caption1-bold text-dark-200 uppercase tracking-wider block">Total Customer Reviews</span>
          <div>
            <span className="text-h4-bold text-main-font block tracking-tight">1,824</span>
            <div className="flex items-center gap-1 mt-1 text-emerald-500 font-bold text-[10px]">
              <span>+45 new this week</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm flex flex-col justify-between h-30">
          <span className="text-caption1-bold text-dark-200 uppercase tracking-wider block">Response Rate</span>
          <div>
            <span className="text-h4-bold text-main-font block tracking-tight">98.5%</span>
            <div className="flex items-center gap-1 mt-1 text-emerald-500 font-bold text-[10px]">
              <span>Within standard SLA limits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-dark-50 rounded-2xl hover:bg-dark-50/50 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-caption1-bold text-main-font">{rev.customer}</h4>
                  <span className="text-caption1-bold text-dark-200 uppercase tracking-wider block mt-0.5">{rev.service}</span>
                </div>
                <span className="text-caption1-bold text-dark-200">{rev.date}</span>
              </div>
              <div className="flex items-center gap-1 mb-2.5">
                {[...Array(5)].map((_, i) => (
                  <Icon 
                    key={i} 
                    icon="solar:star-bold" 
                    className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-amber-400' : 'text-dark-50'}`} 
                  />
                ))}
              </div>
              <p className="text-caption1 text-subtitle-2 leading-relaxed font-semibold">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
