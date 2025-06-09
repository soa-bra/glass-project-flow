
import { useState } from 'react';
import { Project } from '@/types/project';
import FinancialCard from './dashboard/FinancialCard';
import ProjectCalendarCard from './dashboard/ProjectCalendarCard';
import AnalyticsCard from './dashboard/AnalyticsCard';
import KPICard from './dashboard/KPICard';

interface ProjectDashboardProps {
  project: Project;
  onClose: () => void;
}

const ProjectDashboard = ({ project, onClose }: ProjectDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const tabs = [
    { id: 'dashboard', label: 'لوحة التحكم' },
    { id: 'tasks', label: 'المهام' },
    { id: 'financials', label: 'الماليات' },
    { id: 'legals', label: 'القانونية' },
    { id: 'client', label: 'معلومات العميل' },
    { id: 'reports', label: 'التقارير' },
  ];

  return (
    <div className="fixed inset-0 z-dashboard-panel slide-in-right">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 w-1/2 h-full glass">
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-medium text-purple-700 mb-1">
                {project.title}
              </h1>
              <span 
                className="text-base px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: project.phaseColor }}
              >
                {project.phase}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-2xl text-navy-700 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center"
            >
              ×
            </button>
          </div>
          
          {/* Quick Actions Panel */}
          <div className="mb-6 p-4 glass rounded-lg">
            <div className="flex gap-4 justify-center">
              <button className="px-4 py-2 bg-soabra-primary-blue text-white rounded-md hover:bg-soabra-primary-blue-hover transition-colors text-sm">
                إضافة مهمة
              </button>
              <button className="px-4 py-2 bg-soabra-warning text-white rounded-md hover:opacity-90 transition-opacity text-sm">
                توليد ذكي
              </button>
              <button className="px-4 py-2 bg-soabra-success text-white rounded-md hover:opacity-90 transition-opacity text-sm">
                تعديل المشروع
              </button>
            </div>
          </div>
          
          {/* Tabs Bar */}
          <div className="mb-6">
            <div className="flex gap-1 bg-white/10 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-2 rounded-md text-sm transition-all
                    ${activeTab === tab.id 
                      ? 'bg-soabra-primary-blue text-white font-medium' 
                      : 'text-soabra-text-secondary hover:bg-white/10'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Financial Card - Always present */}
              <FinancialCard />
              
              {/* Project Calendar Card - Always present */}
              <ProjectCalendarCard />
              
              {/* Analytics Card - AI determined */}
              <AnalyticsCard />
              
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                <KPICard
                  icon="👥"
                  value="12"
                  label="أعضاء الفريق"
                />
                <KPICard
                  icon="✅"
                  value="85%"
                  label="معدل الإنجاز"
                />
                <KPICard
                  icon="📅"
                  value="15"
                  label="أيام متبقية"
                />
                <KPICard
                  icon="🎯"
                  value="92%"
                  label="رضا العميل"
                />
              </div>
            </div>
          )}
          
          {/* Other tab contents */}
          {activeTab !== 'dashboard' && (
            <div className="glass rounded-lg p-6 text-center">
              <p className="text-soabra-text-secondary">
                محتوى تبويب {tabs.find(t => t.id === activeTab)?.label} قيد التطوير...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
