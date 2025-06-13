
import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

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
      rounded-2xl p-4 relative overflow-hidden
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-sm transition-all duration-300
    `}>
      
      {/* المحتوى */}
      <div className="relative z-10">
        {/* رأس البطاقة */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <FileText size={16} className="text-green-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-800 font-arabic">
            العقود
          </h3>
        </div>

        {/* الرقم الرئيسي مع أيقونة */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {contracts.signed}
            </div>
            <div className="text-xs text-gray-600 font-arabic">
              عقد موقع
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle size={20} className="text-green-500" />
          </div>
        </div>

        {/* إحصائيات بسيطة */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10">
            <span className="text-xs text-gray-700 font-arabic">موقعة</span>
            <span className="text-sm font-medium text-green-600">{contracts.signed}</span>
          </div>
          
          {contracts.expired > 0 && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10">
              <span className="text-xs text-gray-700 font-arabic">منتهية</span>
              <span className="text-sm font-medium text-orange-600">{contracts.expired}</span>
            </div>
          )}
        </div>

        {/* تنبيه إذا وجدت عقود منتهية */}
        {contracts.expired > 0 && (
          <div className="mt-3 p-2 bg-orange-500/10 rounded-lg">
            <p className="text-xs text-orange-700 text-center font-arabic">
              ⚠️ يوجد عقود تحتاج تجديد
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
