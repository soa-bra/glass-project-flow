
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectTab, PROJECT_TABS } from './types';

interface ProjectPanelTabsProps {
  activeTab: ProjectTab;
  onTabChange: (tab: ProjectTab) => void;
}

export const ProjectPanelTabs: React.FC<ProjectPanelTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="bg-white/20 backdrop-blur-[10px] border-b border-white/30">
      <div className="flex overflow-x-auto scrollbar-hide">
        {PROJECT_TABS.map((tab, index) => (
          <motion.button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`
              flex-shrink-0 px-6 py-4 text-sm font-medium transition-all duration-200 font-arabic relative
              ${activeTab === tab.value
                ? 'text-sky-600 bg-white/20'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/10'
              }
            `}
            style={{ 
              height: '56px',
              fontFamily: 'IBM Plex Sans Arabic'
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.label}
            {activeTab === tab.value && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500"
                layoutId="activeTabIndicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
