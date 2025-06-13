
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ContractCount {
  signed: number;
  pending: number;
  expired: number;
}

interface UpcomingContract {
  id: number;
  title: string;
  date: string;
  client: string;
}

interface LegalData {
  contracts: ContractCount;
  upcoming: UpcomingContract[];
}

interface LegalTabProps {
  data?: LegalData;
  loading: boolean;
}

export const LegalTab: React.FC<LegalTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center">جارٍ التحميل...</div>;
  }

  const total = data.contracts.signed + data.contracts.pending + data.contracts.expired;
  const signedPercentage = Math.round((data.contracts.signed / total) * 100);
  const pendingPercentage = Math.round((data.contracts.pending / total) * 100);
  const expiredPercentage = Math.round((data.contracts.expired / total) * 100);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-arabic font-medium text-right">الشؤون القانونية</h2>
      
      {/* عداد العقود */}
      <div className="glass-enhanced rounded-[40px] p-6 transition-all duration-200 ease-in-out hover:bg-white/50">
        <h3 className="text-xl font-arabic font-medium text-right mb-4">حالة العقود</h3>
        
        <div className="flex justify-between items-center my-4">
          <div className="text-center">
            <span className="block text-2xl font-bold text-blue-600">{data.contracts.signed}</span>
            <span className="text-sm text-gray-600">موقّعة</span>
          </div>
          
          <div className="text-center">
            <span className="block text-2xl font-bold text-amber-500">{data.contracts.pending}</span>
            <span className="text-sm text-gray-600">قيد المعالجة</span>
          </div>
          
          <div className="text-center">
            <span className="block text-2xl font-bold text-red-500">{data.contracts.expired}</span>
            <span className="text-sm text-gray-600">منتهية</span>
          </div>
        </div>

        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-blue-600 left-0" 
            style={{ width: `${signedPercentage}%` }}
          ></div>
          <div 
            className="absolute h-full bg-amber-500" 
            style={{ width: `${pendingPercentage}%`, left: `${signedPercentage}%` }}
          ></div>
          <div 
            className="absolute h-full bg-red-500" 
            style={{ width: `${expiredPercentage}%`, left: `${signedPercentage + pendingPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs mt-2">
          <span className="text-blue-600">موقّعة</span>
          <span className="text-amber-500">قيد المعالجة</span>
          <span className="text-red-500">منتهية</span>
        </div>
      </div>
      
      {/* جدول أقرب 3 عقود للتجديد */}
      <div>
        <h3 className="text-xl font-arabic font-medium text-right mb-4">أقرب العقود للتجديد</h3>
        
        <div className="grid gap-3">
          {data.upcoming.map(contract => {
            // حساب الأيام المتبقية
            const daysLeft = Math.ceil((new Date(contract.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div 
                key={contract.id} 
                className="glass-enhanced rounded-[40px] p-4 transition-all duration-200 ease-in-out hover:bg-white/50"
              >
                <div className="flex justify-between items-center">
                  <div className="text-center bg-gray-100 rounded-full py-1 px-3 text-sm">
                    <span className={`font-bold ${daysLeft < 10 ? 'text-red-500' : 'text-blue-600'}`}>
                      {daysLeft} أيام
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <h4 className="font-medium">{contract.title}</h4>
                    <p className="text-sm text-gray-600">{contract.client}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(contract.date).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* زر رفع عقد */}
      <div className="flex justify-center mt-6">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          رفع عقد جديد
        </button>
      </div>
    </div>
  );
};
