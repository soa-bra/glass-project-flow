
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

export const DataVisualizationCard: React.FC = () => {
  return (
    <div className="h-full space-y-4">
      {/* بطاقة البيانات الأولى */}
      <BaseCard className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-arabic text-gray-800 font-semibold">بيانات</h3>
          <span className="text-lg font-bold text-gray-800">17</span>
        </div>
        <p className="text-xs text-gray-500 font-arabic mb-3">هذا النص هو مثال للشكل الحالي</p>
        
        {/* الخطوط الأفقية */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-300 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-arabic mt-2">هذا النص هو مثال للشكل الحالي</p>
      </BaseCard>

      {/* بطاقة البيانات الثانية */}
      <BaseCard className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-arabic text-gray-800 font-semibold">بيانات</h3>
          <span className="text-lg font-bold text-gray-800">03</span>
        </div>
        <p className="text-xs text-gray-500 font-arabic mb-3">هذا النص هو مثال للشكل الحالي</p>
        
        {/* الرسم البياني المتعرج */}
        <div className="h-12 mb-2">
          <svg className="w-full h-full" viewBox="0 0 200 48">
            <path
              d="M0,24 Q25,8 50,20 T100,16 T150,28 T200,12"
              stroke="#a855f7"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0,32 Q25,16 50,28 T100,24 T150,36 T200,20"
              stroke="#c084fc"
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            />
          </svg>
        </div>
        <p className="text-xs text-gray-500 font-arabic">هذا النص هو مثال للشكل الحالي</p>
        <p className="text-xs text-gray-400 font-arabic">هذا النص هو مثال</p>
      </BaseCard>

      {/* بطاقة البيانات الثالثة */}
      <BaseCard className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-arabic text-gray-800 font-semibold">بيانات</h3>
          <span className="text-lg font-bold text-gray-800">03</span>
        </div>
        <p className="text-xs text-gray-500 font-arabic mb-3">هذا النص هو مثال للشكل الحالي</p>
        
        {/* الرسم البياني العمودي */}
        <div className="flex items-end justify-between h-12 gap-1 mb-2">
          <div className="bg-yellow-400 w-4 h-8 rounded-t"></div>
          <div className="bg-yellow-300 w-4 h-6 rounded-t"></div>
          <div className="bg-yellow-500 w-4 h-10 rounded-t"></div>
          <div className="bg-yellow-400 w-4 h-7 rounded-t"></div>
          <div className="bg-yellow-300 w-4 h-9 rounded-t"></div>
          <div className="bg-yellow-400 w-4 h-5 rounded-t"></div>
          <div className="bg-yellow-500 w-4 h-8 rounded-t"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 font-arabic">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>
      </BaseCard>

      {/* بطاقة البيانات الرابعة - الدائرة */}
      <BaseCard className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-arabic text-gray-800 font-semibold">بيانات</h3>
          <span className="text-lg font-bold text-gray-800">03</span>
        </div>
        <p className="text-xs text-gray-500 font-arabic mb-3">هذا النص هو مثال للشكل الحالي</p>
        
        {/* الدائرة */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="#06b6d4"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="44 176"
                strokeDashoffset="0"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-800">20%</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-arabic text-center mt-2">هذا النص هو مثال للشكل الحالي</p>
      </BaseCard>
    </div>
  );
};
