
import React, { useState } from 'react';

import { OverviewTab } from './OverviewTab';
import { ClientsTab } from './ClientsTab';
import { FinanceTab } from './FinanceTab';
import { ProjectsTab } from './ProjectsTab';
import { MarketingTab } from './MarketingTab';
import { ReportsTab } from './ReportsTab';
import { OperationsBoardHeader } from './OperationsBoardHeader';
import { TopStats } from './TopStats';
import { QuickActionButtons } from './QuickActionButtons';

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
      <OperationsBoardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <TopStats />
      
      {/* منطقة عرض محتوى التبويب النشط */}
      <div className="w-full flex-1 px-1.5 h-[calc(100%-190px)]">
        {renderActiveTab()}
      </div>

      <QuickActionButtons />

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
