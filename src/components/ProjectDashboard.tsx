
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
    <div className="w-full h-full bg-white/95 backdrop-blur-sm rounded-2xl m-6 shadow-2xl border border-white/70 overflow-hidden">
      <div className="p-6 h-full overflow-y-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200/60">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-6 h-6 rounded-full border-3 border-white shadow-lg"
                style={{ backgroundColor: project.phaseColor }}
              />
              <h1 className="text-3xl font-bold text-gray-800">
                {project.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-8 mb-4">
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm px-4 py-2 rounded-full text-white font-bold shadow-lg"
                  style={{ backgroundColor: project.phaseColor }}
                >
                  {project.phase}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-5 h-5" />
                <span className="font-medium">المدير: {project.assignee}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">الميزانية: {parseInt(project.value).toLocaleString()} ر.س</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl">
              تطوير الواجهة الإلكترونية الداخلي لإدارة عمليات سوبرا الشامل
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors group"
          >
            <X className="w-6 h-6 text-gray-500 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-3 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg">
            {[1, 2, 3, 4, 5, 6, 7].map((phase, index) => (
              <div key={phase} className="flex items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500
                  ${index < 3 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-110' 
                    : 'bg-white border-3 border-gray-300 text-gray-500 shadow-md'
                  }
                `}>
                  {phase}
                </div>
                {index < 6 && (
                  <div className={`
                    w-10 h-2 mx-3 rounded-full transition-all duration-500
                    ${index < 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced Quick Actions */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg">
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-bold hover:scale-105">
              إضافة مهمة
            </button>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-bold hover:scale-105">
              توليد ذكي
            </button>
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-bold hover:scale-105">
              تعديل المشروع
            </button>
          </div>
        </div>
        
        {/* Enhanced Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 bg-gray-100/80 rounded-2xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 rounded-xl text-sm transition-all duration-300 flex-1 justify-center font-bold
                  ${activeTab === tab.id 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-md'
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
          <div className="space-y-8">
            {/* Financial Card */}
            <FinancialCard />
            
            {/* Project Calendar Card */}
            <ProjectCalendarCard />
            
            {/* Analytics Card */}
            <AnalyticsCard />
            
            {/* Enhanced KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-6">
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
          <div className="bg-white/90 rounded-2xl p-12 text-center shadow-xl border border-gray-200/50">
            <div className="flex flex-col items-center gap-6">
              {tabs.find(t => t.id === activeTab)?.icon && (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  {React.createElement(tabs.find(t => t.id === activeTab)!.icon, { 
                    className: "w-10 h-10 text-purple-600" 
                  })}
                </div>
              )}
              <p className="text-gray-600 text-xl font-medium">
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
