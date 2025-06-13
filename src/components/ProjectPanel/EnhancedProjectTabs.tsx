
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectTab, PROJECT_TABS } from './types';

interface EnhancedProjectTabsProps {
  activeTab: ProjectTab;
  onTabChange: (tab: ProjectTab) => void;
}

export const EnhancedProjectTabs: React.FC<EnhancedProjectTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="bg-white/20 backdrop-blur-[10px] border-b border-white/20">
      <div className="flex overflow-x-auto scrollbar-hide">
        {PROJECT_TABS.map((tab, index) => (
          <motion.button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`
              flex-shrink-0 px-6 py-4 text-sm font-medium transition-all duration-200 font-arabic relative
              ${activeTab === tab.value
                ? 'text-sky-600 bg-white/10'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/5'
              }
            `}
            style={{ height: '48px' }}
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
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
