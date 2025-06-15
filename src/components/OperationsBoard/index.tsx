
import React, { useState } from 'react';
import { TAB_ITEMS } from './types';
import { ChevronLeft, Plus, Zap, Edit3 } from 'lucide-react';

import { OverviewTab } from './OverviewTab';
import { ClientsTab } from './ClientsTab';
import FinanceTab from './FinanceTab';
import ProjectsTab from './ProjectsTab';
import MarketingTab from './MarketingTab';
import ReportsTab from './ReportsTab';

// new topStats from JSON
const topStats = [
  {
    label: 'الإيرادات اليومية',
    value: '12,500 ﷼',
    icon: <ChevronLeft size={22} strokeWidth={1.5} />,
  },
  {
    label: 'المشاريع الجارية',
    value: 8,
    icon: <ChevronLeft size={22} strokeWidth={1.5} />,
  },
  {
    label: 'الشكـاوى',
    value: 2,
    icon: <ChevronLeft size={22} strokeWidth={1.5} />,
  },
];

const tabClass = (active: boolean) =>
  `font-arabic rounded-full px-7 py-2.5 text-base transition-all 
   ${active ? 'bg-black text-white shadow-sm' : 'bg-white/0 border border-gray-300 text-black'} 
   font-semibold`;

export const OperationsBoard = ({
  isSidebarCollapsed,
  isPanelOpen
}: {
  isSidebarCollapsed: boolean;
  isPanelOpen?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'finance':
        return <FinanceTab data={undefined} loading={true} />;
      case 'projects':
        return <ProjectsTab data={undefined} loading={true} />;
      case 'marketing':
          return <MarketingTab data={undefined} loading={true} />;
      case 'clients':
        // NOTE: I am mocking the data for clients tab to avoid it being in a loading state
        return <ClientsTab data={{ active: [{id: 1, name: "مشروع وهمي", projects: 2}], nps: [{id: 1, score: 9, client: "عميل وهمي"}] }} loading={false} />;
      case 'reports':
        return <ReportsTab data={undefined} loading={true} />;
      default:
        return <OverviewTab />;
    }
  };
  
  // A crude way to not play animation on first render
  const [isInitialRender, setIsInitialRender] = useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setIsInitialRender(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const animationClass = isInitialRender ? '' : isPanelOpen ? 'animate-slide-out-right' : 'animate-slide-in-right';

  return (
    <div
      className={`fixed transition-all duration-500 ease-in-out operations-board-expanded ${animationClass}`}
      style={{
        height: 'calc(100vh - 60px)',
        top: 'var(--sidebar-top-offset)',
        borderRadius: '28px',
        background: '#d6e8eb',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        zIndex: 30,
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        direction: 'rtl'
      }}
    >
      {/* رأس اللوحة (العنوان + أزرار التبويب) */}
      <div className="w-full px-8 pt-8 pb-2 flex items-center justify-between">
        <div>
          <h2 className="text-[2rem] md:text-[2.1rem] font-black tracking-tight m-0 pb-1 font-arabic"
            style={{
              color: '#181b29',
              fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif'
            }}>لوحة الإدارة والتشغيل</h2>
        </div>
        {/* أزرار التبويبات */}
        <div className="flex gap-2.5 mt-1 mb-1">
          {TAB_ITEMS.map(tab =>
            <button
              type="button"
              key={tab.value}
              className={tabClass(activeTab === tab.value)}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          )}
        </div>
      </div>
      {/* سطر الإحصائيات الفورية */}
      <div className="w-full flex justify-between items-center gap-4 px-8 pb-2">
        {topStats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-end gap-3 flex-1 min-w-0"
            style={{
              background: 'none',
              boxShadow: 'none'
            }}
          >
            <div className="flex flex-col items-end text-right">
              <span className="text-[1.3rem] font-extrabold font-arabic leading-tight block text-black mb-0">
                {stat.value}
              </span>
              <span className="text-[14px] text-black/75 font-medium font-arabic">{stat.label}</span>
            </div>
            <span className="bg-white/45 rounded-full p-2.5 flex items-center justify-center ml-2 border border-gray-300 shadow-sm"
                  style={{
                    boxShadow: 'inset 0 1px 5px 0 rgba(40,90,150,0.10)'
                  }}>
              {stat.icon}
            </span>
          </div>
        ))}
      </div>
      
      {/* منطقة عرض محتوى التبويب النشط */}
      <div className="w-full flex-1 px-1.5 h-[calc(100%-190px)]">
        {renderActiveTab()}
      </div>

      {/* أزرار الإجراءات السريعة */}
      <div className="absolute top-[120px] left-8 flex flex-col gap-3 z-50">
        <button className="w-12 h-12 rounded-full bg-[#4AB5FF] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
          <Plus size={24} />
        </button>
        <button className="w-12 h-12 rounded-full bg-[#FFCC55] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
          <Zap size={24} />
        </button>
        <button className="w-12 h-12 rounded-full bg-[#999999] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
          <Edit3 size={24} />
        </button>
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
