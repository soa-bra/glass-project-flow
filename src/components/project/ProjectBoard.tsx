
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Project } from '@/types/project';
import { ProjectHeader } from './ProjectHeader';
import { ProjectTabs } from './ProjectTabs';
import { OverviewTab } from './tabs/OverviewTab';
import { TasksTab } from './tabs/TasksTab';
import { FinanceTab } from './tabs/FinanceTab';
import { LegalTab } from './tabs/LegalTab';
import { WorkInfoTab } from './tabs/WorkInfoTab';
import { ReportsTab } from './tabs/ReportsTab';
import { ControlsTab } from './tabs/ControlsTab';

interface ProjectBoardProps {
  project: Project;
  visible: boolean;
  onClose: () => void;
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({
  project,
  visible,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // إغلاق بالضغط على Esc
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [visible, onClose]);

  // منع التمرير في الخلفية عند فتح اللوحة
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  // تدرج لوني حسب ID المشروع
  const projectGradient = React.useMemo(() => {
    const hash = project.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const hue = Math.abs(hash) % 360;
    
    return `conic-gradient(from ${hue}deg, 
      hsl(${hue}, 70%, 95%) 0deg,
      hsl(${(hue + 60) % 360}, 65%, 92%) 120deg,
      hsl(${(hue + 120) % 360}, 60%, 90%) 240deg,
      hsl(${hue}, 70%, 95%) 360deg)`;
  }, [project.id]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab project={project} />;
      case 'tasks':
        return <TasksTab project={project} />;
      case 'finance':
        return <FinanceTab project={project} />;
      case 'legal':
        return <LegalTab project={project} />;
      case 'workinfo':
        return <WorkInfoTab project={project} />;
      case 'reports':
        return <ReportsTab project={project} />;
      case 'controls':
        return <ControlsTab project={project} />;
      default:
        return <OverviewTab project={project} />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-50 transition-all duration-700 ease-[cubic-bezier(.25,.1,.25,1)]
          ${visible 
            ? 'bg-black/20 backdrop-blur-[2px] opacity-100' 
            : 'bg-black/0 opacity-0 pointer-events-none'
          }
        `}
        onClick={onClose}
      />

      {/* لوحة المشروع */}
      <div
        dir="rtl"
        className={`
          fixed top-0 right-0 h-screen w-full lg:w-[65%] z-[60]
          backdrop-blur-[24px] shadow-[0_4px_24px_rgb(0_0_0/0.15)]
          rounded-s-[32px] overflow-hidden font-arabic
          transition-[transform,opacity] duration-700 ease-[cubic-bezier(.25,.1,.25,1)]
          ${visible
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0 pointer-events-none'
          }
        `}
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%), ${projectGradient}`
        }}
      >
        
        {/* رأس اللوحة */}
        <ProjectHeader project={project} onClose={onClose} />

        {/* شريط التبويبات */}
        <ProjectTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* محتوى التبويب */}
        <div className="h-[calc(100vh-160px)] overflow-y-auto px-6 pb-6">
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};
