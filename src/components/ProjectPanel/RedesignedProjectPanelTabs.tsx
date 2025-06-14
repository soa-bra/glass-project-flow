
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectTab, PROJECT_TABS } from './types';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface RedesignedProjectPanelTabsProps {
  activeTab: ProjectTab;
  onTabChange: (tab: ProjectTab) => void;
}

export const RedesignedProjectPanelTabs: React.FC<RedesignedProjectPanelTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const config = useLovableConfig();
  return (
    <div className="w-full px-4 py-1 bg-transparent relative">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-white/30 bg-transparent items-end">
        {PROJECT_TABS.map((tab, idx) => (
          <motion.button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`
              font-bold flex-shrink-0 px-6 py-2 text-base transition-all duration-200 rounded-t-[16px] relative
              ${activeTab === tab.value
                ? 'text-white bg-gradient-to-b from-[#7C4DFF]/90 to-[#81D4FA] shadow-lg'
                : 'text-gray-700 bg-white/0 hover:bg-white/20'
              }
            `}
            style={{
              fontFamily: config.theme.font,
              minWidth: 110,
              height: 48,
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            {tab.label}
            {activeTab === tab.value && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-full"
                style={{ background: 'white' }}
                layoutId="activeTabIndicator"
                transition={{ type: 'spring', stiffness: 530, damping: 25 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
