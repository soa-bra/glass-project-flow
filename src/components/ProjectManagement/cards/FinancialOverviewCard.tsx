
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const FinancialOverviewCard: React.FC = () => {
  return (
    <BaseCard className="h-full p-6">
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-arabic text-gray-600">النظرة المالية</h3>
        <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-arabic">
          ###
        </button>
      </div>

      {/* الدائرة الرئيسية */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* الدائرة الخارجية متعددة الألوان */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* الخلفية */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#f3f4f6"
              strokeWidth="8"
              fill="transparent"
            />
            {/* القسم الأحمر */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#ef4444"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="15 235"
              strokeDashoffset="0"
            />
            {/* القسم الأزرق */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#3b82f6"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="40 210"
              strokeDashoffset="-15"
            />
            {/* القسم الأخضر */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#10b981"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="80 170"
              strokeDashoffset="-55"
            />
            {/* باقي القسم الأخضر الفاتح */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#86efac"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="115 135"
              strokeDashoffset="-135"
            />
          </svg>
          
          {/* الرقم في المنتصف */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">20</div>
              <div className="text-xs text-gray-500 font-arabic">الف ريال</div>
            </div>
          </div>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600 font-arabic">02</span>
          </div>
          <span className="text-xs text-gray-500 font-arabic">مليون</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600 font-arabic">14</span>
          </div>
          <span className="text-xs text-gray-500 font-arabic">مليون</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600 font-arabic">78</span>
          </div>
          <span className="text-xs text-gray-500 font-arabic">مليون</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            <span className="text-xs text-gray-600 font-arabic">03</span>
          </div>
          <span className="text-xs text-gray-500 font-arabic">مليون</span>
        </div>
      </div>

      {/* النص السفلي */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 font-arabic">هذا النص هو مثال للشكل الحالي</p>
        <p className="text-xs text-gray-500 font-arabic">هذا النص هو مثال</p>
      </div>
    </BaseCard>
  );
};
