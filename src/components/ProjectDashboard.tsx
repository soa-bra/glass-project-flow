
import { useState } from 'react';
import { Project } from '@/pages/Index';
import { X } from 'lucide-react';
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
      className="h-full rounded-3xl shadow-2xl border border-white/30 overflow-hidden backdrop-blur-xl"
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {project.title}
            </h1>
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div 
                className="px-4 py-2 rounded-2xl text-white font-medium shadow-lg"
                style={{ 
                  backgroundColor: project.phaseColor,
                  boxShadow: `0 4px 15px ${project.phaseColor}40`
                }}
              >
                {project.phase}
              </div>
              <div className="bg-white/60 rounded-2xl px-4 py-2 border border-white/40 backdrop-blur-sm">
                <span className="text-gray-800 font-bold">
                  {parseInt(project.value).toLocaleString()} ريال سعودي
                </span>
              </div>
              <div className="bg-white/60 rounded-2xl px-4 py-2 border border-white/40 backdrop-blur-sm">
                <span className="text-gray-700 font-medium">
                  مدير المشروع: {project.assignee}
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-4 hover:bg-white/30 rounded-2xl transition-all duration-300 border border-white/20 ml-4"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Progress Bar (7 phases) */}
        <div className="mb-8 p-6 rounded-3xl border border-white/30"
             style={{
               background: 'rgba(255, 255, 255, 0.4)',
               backdropFilter: 'blur(15px)',
               WebkitBackdropFilter: 'blur(15px)',
             }}>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">تقدم المشروع</h3>
          <div className="flex items-center gap-3 mb-4">
            {phases.map((phase, index) => (
              <div key={index} className="flex items-center flex-1">
                <div
                  className={`h-4 rounded-full flex-1 transition-all duration-500 ${
                    phase.completed 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg' 
                      : 'bg-white/40 backdrop-blur-sm border border-white/30'
                  }`}
                  style={phase.completed ? { 
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' 
                  } : {}}
                />
                {index < phases.length - 1 && (
                  <div className="w-3 h-1 bg-white/30 mx-2 rounded-full" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            {phases.map((phase, index) => (
              <span 
                key={index} 
                className={`font-medium ${
                  phase.completed ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {phase.name}
              </span>
            ))}
          </div>
        </div>
        
        {/* Quick Actions Panel */}
        <div className="mb-8 p-6 rounded-3xl border border-white/30"
             style={{
               background: 'rgba(255, 255, 255, 0.4)',
               backdropFilter: 'blur(15px)',
               WebkitBackdropFilter: 'blur(15px)',
             }}>
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              className="px-6 py-3 text-white rounded-2xl hover:scale-105 transition-all duration-300 font-medium shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              إضافة مهمة
            </button>
            <button 
              className="px-6 py-3 text-white rounded-2xl hover:scale-105 transition-all duration-300 font-medium shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)'
              }}
            >
              توليد ذكي
            </button>
            <button 
              className="px-6 py-3 text-white rounded-2xl hover:scale-105 transition-all duration-300 font-medium shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)'
              }}
            >
              تعديل المشروع
            </button>
          </div>
        </div>
        
        {/* Tabs Bar */}
        <div className="mb-8">
          <div className="flex gap-2 bg-white/20 rounded-2xl p-2 backdrop-blur-sm border border-white/30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative
                  ${activeTab === tab.id 
                    ? 'text-blue-600 bg-white/60 shadow-lg border border-white/50' 
                    : 'text-gray-600 hover:bg-white/20'
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
            {/* Financial Card */}
            <FinancialCard />
            
            {/* Project Calendar Card */}
            <ProjectCalendarCard />
            
            {/* Analytics Card */}
            <AnalyticsCard />
            
            {/* KPI Cards Grid */}
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
          <div 
            className="rounded-3xl p-8 text-center border border-white/30"
            style={{
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
            }}
          >
            <p className="text-gray-600 text-lg">
              محتوى تبويب {tabs.find(t => t.id === activeTab)?.label} قيد التطوير...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;
