
import React from 'react';
import { ProjectTab, PROJECT_TABS } from './types';

interface ProjectTabsProps {
  activeTab: ProjectTab;
  onTabChange: (tab: ProjectTab) => void;
}

export const ProjectTabs: React.FC<ProjectTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="bg-white/20 backdrop-blur-[10px] border-b border-white/20 shadow-[inset_0_-1px_0_rgba(255,255,255,0.2)]">
      <div className="flex overflow-x-auto scrollbar-hide">
        {PROJECT_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`
              flex-shrink-0 px-6 py-4 text-sm font-medium transition-all duration-200 font-arabic
              min-h-[48px] flex items-center justify-center
              ${activeTab === tab.value
                ? 'text-sky-600 border-b-2 border-sky-500 bg-white/10'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/5'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
