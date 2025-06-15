
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TAB_ITEMS } from './types';
import { TrendingUp, TrendingDown, Clock, FileText, ListCheck } from 'lucide-react';
import { UpcomingTimelineCard } from './Overview/UpcomingTimelineCard';
// استيراد التبويب الرئيسي
import { OverviewTab } from './OverviewTab';

// عناصر الإحصاءات العلوية كما في التصميم
const topStats = [{
  label: 'عدد المستخدمين',
  value: 150,
  desc: 'المستخدمين في المنصة',
  icon: <TrendingUp size={22} strokeWidth={1.5} />
}, {
  label: 'الطلبات',
  value: 5,
  desc: 'طلبات جديدة اليوم',
  icon: <ListCheck size={22} strokeWidth={1.5} />
}, {
  label: 'عقود منتهية',
  value: 3,
  desc: 'بحاجة لتجديد',
  icon: <FileText size={22} strokeWidth={1.5} />
}, {
  label: 'متأخر',
  value: 3,
  desc: 'مهام متاخرة',
  icon: <Clock size={22} strokeWidth={1.5} />
}];

const tabClass = (active: boolean) => `font-arabic rounded-full px-7 py-2.5 text-base transition-all 
   ${active ? 'bg-black text-white shadow-sm' : 'bg-white/0 border border-gray-300 text-black'} 
   font-semibold`;

export const OperationsBoard = ({
  isSidebarCollapsed
}: {
  isSidebarCollapsed: boolean;
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // عرض التبويب حسب القيمة الحالية
  let content: React.ReactNode = null;
  if (activeTab === 'overview') {
    content = <OverviewTab />;
  }
  // لاحقاً يمكنك إضافة: else if (activeTab === 'projects') { ... }

  return (
    <div className="fixed transition-all duration-500 ease-in-out operations-board-expanded" style={{
      height: 'calc(100vh - 60px)',
      top: 'var(--sidebar-top-offset)',
      borderRadius: '28px',
      background: '#d6e8eb',
      // تم تغيير اللون هنا
      backdropFilter: 'blur(20px)',
      overflow: 'hidden',
      zIndex: 30,
      fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
      direction: 'rtl'
    }}>
      {/* رأس اللوحة (العنوان + أزرار التبويب) */}
      <div className="w-full px-8 pt-8 pb-2 flex items-center justify-between py-[42px]">
        <div>
          <h2 style={{
            color: '#181b29',
            fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'
          }} className="text-[2rem] tracking-tight m-0 pb-1 font-arabic md:text-3xl font-medium">لوحة الإدارة والتشغيل</h2>
        </div>
        {/* أزرار التبويبات */}
        <div className="flex gap-2.5 mt-1 mb-1">
          {TAB_ITEMS.map(tab => (
            <button
              type="button"
              key={tab.value}
              className={tabClass(activeTab === tab.value)}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* محتوى التبويبات الديناميكي */}
      <div className="h-[calc(100%-120px)] w-full overflow-y-auto pr-2">
        {content}
      </div>

      <style>{`
        .animate-fade-in {
          animation: fade-in-card 0.60s cubic-bezier(.36,.2,.05,1.05) both;
        }
        .animate-fade-in.delay-100 { animation-delay: .08s }
        .animate-fade-in.delay-150 { animation-delay: .13s }
        .animate-fade-in.delay-200 { animation-delay: .18s }
        .animate-fade-in.delay-300 { animation-delay: .27s }
        .animate-fade-in.delay-350 { animation-delay: .33s }
        @keyframes fade-in-card {
          0% { opacity: 0; transform: translateY(18px);}
          100% { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default OperationsBoard;
