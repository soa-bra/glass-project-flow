
import React from 'react';
import { OverviewTab } from './OverviewTab';
import { FinanceTab } from './FinanceTab';
import { HRTab } from './HRTab';
import { ClientsTab } from './ClientsTab';
import { LegalTab } from './LegalTab';
import { ReportsTab } from './ReportsTab';
import type { TabType } from './types';

interface TabContentWrapperProps {
  activeTab: TabType;
}

const TabContentWrapper: React.FC<TabContentWrapperProps> = ({ activeTab }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={{ 
          stats: { totalProjects: 0, activeProjects: 0, completedProjects: 0, totalBudget: 0 }
        }} />;
      case 'finance':
        return <FinanceTab data={{ projects: [], overBudget: [] }} />;
      case 'legal':
        return <LegalTab data={{
          contracts: { active: 0, pending: 0, expired: 0 },
          upcoming: []
        }} />;
      case 'hr':
        return <HRTab data={{
          stats: { totalMembers: 0, activeProjects: 0, utilizationRate: 0 },
          distribution: []
        }} />;
      case 'clients':
        return <ClientsTab data={{ active: [], nps: { score: 0, responses: 0 } }} />;
      case 'reports':
        return <ReportsTab data={{ templates: [] }} />;
      default:
        return <OverviewTab data={{ 
          stats: { totalProjects: 0, activeProjects: 0, completedProjects: 0, totalBudget: 0 }
        }} />;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {renderTabContent()}
    </div>
  );
};

export default TabContentWrapper;
