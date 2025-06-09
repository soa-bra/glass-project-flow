
import React, { useState } from 'react';
import { X, BarChart3, Calendar, DollarSign, Users, Settings, FileText, User } from 'lucide-react';
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
    { id: 'dashboard', label: 'لوحة التحكم', icon: BarChart3 },
    { id: 'tasks', label: 'المهام', icon: FileText },
    { id: 'financials', label: 'الماليات', icon: DollarSign },
    { id: 'legals', label: 'القانونية', icon: Settings },
    { id: 'client', label: 'معلومات العميل', icon: User },
    { id: 'reports', label: 'التقارير', icon: FileText },
  ];

  return (
    <div className="w-full h-full bg-white/90 backdrop-blur-sm rounded-lg m-4 shadow-lg border border-white/50 overflow-hidden">
      <div className="p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: project.phaseColor }}
              />
              <h1 className="text-2xl font-bold text-soabra-text-primary">
                {project.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-6 mb-3">
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm px-3 py-1 rounded-full text-white font-medium shadow-sm"
                  style={{ backgroundColor: project.phaseColor }}
                >
                  {project.phase}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-soabra-text-secondary">
                <Users className="w-4 h-4" />
                <span>المدير: {project.assignee}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-soabra-text-secondary">
                <DollarSign className="w-4 h-4" />
                <span>الميزانية: {parseInt(project.value).toLocaleString()} ر.س</span>
              </div>
            </div>
            
            <p className="text-sm text-soabra-text-secondary">
              تطوير الواجهة الإلكترونية الداخلي لإدارة عمليات سوبرا الشامل
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors group"
          >
            <X className="w-6 h-6 text-soabra-text-secondary group-hover:text-soabra-error transition-colors" />
          </button>
        </div>
        
        {/* Progress Bar - 7 Phases */}
        <div className="mb-6">
          <div className="flex items-center gap-2 p-4 bg-gray-50/50 rounded-lg">
            {[1, 2, 3, 4, 5, 6, 7].map((phase, index) => (
              <div key={phase} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${index < 3 
                    ? 'bg-soabra-primary-blue text-white shadow-md' 
                    : 'bg-white border-2 border-gray-200 text-soabra-text-secondary'
                  }
                `}>
                  {phase}
                </div>
                {index < 6 && (
                  <div className={`
                    w-8 h-1.5 mx-2 rounded-full transition-all duration-300
                    ${index < 2 ? 'bg-soabra-primary-blue' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Actions Panel */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50/50 to-blue-50/30 rounded-lg border border-gray-200/30">
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-soabra-primary-blue text-white rounded-lg hover:bg-soabra-primary-blue-hover transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5">
              إضافة مهمة
            </button>
            <button className="px-6 py-3 bg-soabra-warning text-white rounded-lg hover:opacity-90 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5">
              توليد ذكي
            </button>
            <button className="px-6 py-3 bg-soabra-success text-white rounded-lg hover:opacity-90 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5">
              تعديل المشروع
            </button>
          </div>
        </div>
        
        {/* Tabs Bar */}
        <div className="mb-6">
          <div className="flex gap-1 bg-gray-100/80 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-md text-sm transition-all duration-300 flex-1 justify-center
                  ${activeTab === tab.id 
                    ? 'bg-soabra-primary-blue text-white font-medium shadow-md' 
                    : 'text-soabra-text-secondary hover:bg-white/70 hover:text-soabra-text-primary'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Financial Card */}
            <FinancialCard />
            
            {/* Project Calendar Card */}
            <ProjectCalendarCard />
            
            {/* Analytics Card */}
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
          <div className="bg-white/80 rounded-lg p-8 text-center border border-gray-200/30 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              {tabs.find(t => t.id === activeTab)?.icon && (
                <div className="w-16 h-16 rounded-full bg-gray-100/80 flex items-center justify-center">
                  {React.createElement(tabs.find(t => t.id === activeTab)!.icon, { 
                    className: "w-8 h-8 text-soabra-text-secondary" 
                  })}
                </div>
              )}
              <p className="text-soabra-text-secondary text-lg">
                محتوى تبويب {tabs.find(t => t.id === activeTab)?.label} قيد التطوير...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;
