

import React from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';

interface ContractsData {
  signed: number;
  expired: number;
}

interface ContractsWidgetProps {
  contracts: ContractsData;
  className?: string;
}

export const ContractsWidget: React.FC<ContractsWidgetProps> = ({ 
  contracts, 
  className = '' 
}) => {
  const total = contracts.signed + contracts.expired;
  const signedPercentage = total > 0 ? Math.round((contracts.signed / total) * 100) : 0;

  return (
    <div className={`
      ${className}
      rounded-3xl p-6 relative overflow-hidden
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
    `}>
      
      {/* خلفية متدرجة */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-300/20 to-teal-400/20 rounded-3xl"></div>
      
      {/* المحتوى */}
      <div className="relative z-10">
        {/* رأس البطاقة */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#2A3437] font-arabic">
            العقود
          </h3>
        </div>

        {/* الرقم الرئيسي */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-[#2A3437] mb-2">
            {contracts.signed}
          </div>
          <div className="text-sm text-gray-600 font-arabic">
            عقد موقع
          </div>
        </div>

        {/* دائرة مبسطة للحالة */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="url(#contractGradient)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={`${2.2 * signedPercentage} 220`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="contractGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle size={24} className="text-green-500" />
          </div>
        </div>

        {/* التفاصيل */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-green-100/50 backdrop-blur-sm">
            <span className="text-lg font-bold text-green-600">{contracts.signed}</span>
            <span className="text-sm text-gray-700 font-arabic">موقعة</span>
          </div>
          
          {contracts.expired > 0 && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-100/50 backdrop-blur-sm">
              <span className="text-lg font-bold text-orange-600">{contracts.expired}</span>
              <span className="text-sm text-gray-700 font-arabic">منتهية</span>
            </div>
          )}
        </div>

        {/* تحذير إذا وجدت عقود منتهية */}
        {contracts.expired > 0 && (
          <div className="mt-4 p-3 bg-orange-500/20 rounded-2xl backdrop-blur-sm">
            <p className="text-sm font-medium text-orange-700 text-center font-arabic">
              ⚠️ يوجد عقود تحتاج تجديد
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

