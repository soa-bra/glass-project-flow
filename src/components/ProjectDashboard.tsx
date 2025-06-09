import { useState } from 'react';
import { Project } from '@/pages/Index';
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

  // Progress phases (7 phases)
  const phases = [
    { name: 'التخطيط', completed: true },
    { name: 'التصميم', completed: true },
    { name: 'التطوير', completed: true },
    { name: 'المراجعة', completed: false },
    { name: 'الاختبار', completed: false },
    { name: 'النشر', completed: false },
    { name: 'التسليم', completed: false },
  ];

  return (
    <div 
      className="h-full rounded-t-2xl shadow-lg border border-gray-100 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E8F2FE 0%, #F9DBF8 50%, #DAD4FC 100%)',
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0'
      }}
    >
      <div className="p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium mb-2" style={{ color: '#4B0082' }}>
              {project.title}
            </h1>
            <div className="flex items-center gap-4 mb-2">
              <span 
                className="text-sm px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: project.phaseColor }}
              >
                {project.phase}
              </span>
              <span className="text-sm text-soabra-text-secondary">
                {project.value} ريال سعودي
              </span>
              <span className="text-sm text-soabra-text-secondary">
                مدير المشروع: {project.assignee}
              </span>
            </div>
            <p className="text-sm text-soabra-text-secondary">
              {project.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ color: '#1e3a8a' }}
          >
            ×
          </button>
        </div>

        {/* Progress Bar (7 phases) */}
        <div className="mb-6 p-4 glass rounded-lg">
          <h3 className="text-lg font-medium text-soabra-text-primary mb-3">تقدم المشروع</h3>
          <div className="flex items-center gap-2">
            {phases.map((phase, index) => (
              <div key={index} className="flex items-center flex-1">
                <div
                  className={`h-3 rounded-full flex-1 transition-all duration-300 ${
                    phase.completed 
                      ? 'bg-soabra-primary-blue' 
                      : 'bg-white/30 backdrop-blur-sm border border-white/20'
                  }`}
                />
                {index < phases.length - 1 && (
                  <div className="w-2 h-0.5 bg-white/20 mx-1" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-soabra-text-secondary">
            {phases.map((phase, index) => (
              <span key={index} className={phase.completed ? 'text-soabra-primary-blue font-medium' : ''}>
                {phase.name}
              </span>
            ))}
          </div>
        </div>
        
        {/* Quick Actions Panel */}
        <div className="mb-6 p-4 glass rounded-lg">
          <div className="flex gap-4 justify-center">
            <button className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity text-sm"
                    style={{ backgroundColor: '#0099FF' }}>
              إضافة مهمة
            </button>
            <button className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity text-sm"
                    style={{ backgroundColor: '#FBBF24' }}>
              توليد ذكي
            </button>
            <button className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity text-sm"
                    style={{ backgroundColor: '#00C853' }}>
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
                  px-4 py-2 rounded-md text-sm transition-all relative
                  ${activeTab === tab.id 
                    ? 'text-soabra-primary-blue font-medium' 
                    : 'text-soabra-text-secondary hover:bg-white/10'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full"
                    style={{ backgroundColor: '#87CEEB' }}
                  />
                )}
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
  );
};

export default ProjectDashboard;
