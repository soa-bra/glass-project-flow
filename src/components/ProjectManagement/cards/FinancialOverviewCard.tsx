
import React from 'react';

export const FinancialOverviewCard: React.FC = () => {
  return (
    <div 
      className="h-full p-6 rounded-3xl border border-white/20"
      style={{
        background: 'var(--backgrounds-cards-admin-ops)',
      }}
    >
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-arabic font-semibold text-gray-800">النظرة المالية</h3>
        <button className="text-xs bg-white/40 backdrop-filter backdrop-blur-lg text-gray-600 px-3 py-1 rounded-lg font-arabic border border-white/20 hover:bg-white/60 transition-colors">
          تفاصيل
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
              stroke="#f1b5b9"
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
              stroke="#a4e2f6"
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
              stroke="#bdeed3"
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
              stroke="#96d8d0"
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
              <div className="text-xs text-gray-500 font-arabic">ألف ريال</div>
            </div>
          </div>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#f1b5b9' }}></div>
            <span className="text-sm text-gray-700 font-arabic font-medium">02</span>
          </div>
          <span className="text-sm text-gray-500 font-arabic">مليون</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#a4e2f6' }}></div>
            <span className="text-sm text-gray-700 font-arabic font-medium">14</span>
          </div>
          <span className="text-sm text-gray-500 font-arabic">مليون</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#bdeed3' }}></div>
            <span className="text-sm text-gray-700 font-arabic font-medium">78</span>
          </div>
          <span className="text-sm text-gray-500 font-arabic">مليون</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#96d8d0' }}></div>
            <span className="text-sm text-gray-700 font-arabic font-medium">03</span>
          </div>
          <span className="text-sm text-gray-500 font-arabic">مليون</span>
        </div>
      </div>

      {/* النص السفلي */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 font-arabic leading-relaxed">هذا النص هو مثال للشكل الحالي</p>
        <p className="text-xs text-gray-500 font-arabic">هذا النص هو مثال</p>
      </div>
    </div>
  );
};
