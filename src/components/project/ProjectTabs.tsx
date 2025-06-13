
import React from 'react';
import { 
  BarChart3, 
  CheckSquare, 
  DollarSign, 
  FileText, 
  Users, 
  FileBarChart, 
  Settings 
} from 'lucide-react';

interface ProjectTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
  { id: 'tasks', label: 'المهام', icon: CheckSquare },
  { id: 'finance', label: 'المالية', icon: DollarSign },
  { id: 'legal', label: 'القانونية', icon: FileText },
  { id: 'workinfo', label: 'معلومات العمل', icon: Users },
  { id: 'reports', label: 'التقارير', icon: FileBarChart },
  { id: 'controls', label: 'التحكم', icon: Settings },
];

export const ProjectTabs: React.FC<ProjectTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="px-6 py-4 border-b border-white/10">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-2xl
                text-sm font-medium whitespace-nowrap transition-all duration-300
                ${isActive
                  ? 'bg-white/25 text-gray-800 shadow-sm backdrop-blur-sm border border-white/30'
                  : 'text-gray-600 hover:bg-white/15 hover:text-gray-700'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
