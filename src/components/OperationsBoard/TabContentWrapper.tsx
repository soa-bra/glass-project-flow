
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { OverviewTab } from './OverviewTab';
import { FinanceTab } from './FinanceTab';
import { ProjectsTab } from './ProjectsTab';
import { MarketingTab } from './MarketingTab';
import LegalTab from './LegalTab';
import HRTab from './HRTab';
import { ClientsTab } from './ClientsTab';
import { ReportsTab } from './ReportsTab';
import type { TabData } from './types';

export const TabContentWrapper = ({
  tabData,
  loading,
}: {
  tabData: TabData;
  loading: boolean;
}) => {
  return <>
      <TabsContent value="overview" className="overflow-auto p-0 m-0 px-0 my-0">
        <OverviewTab data={tabData.overview || { stats: { expectedRevenue: 0, complaints: 0, delayedProjects: 0 } }} loading={loading} />
      </TabsContent>
      
      <TabsContent value="finance" className="overflow-auto p-0 m-0 px-0 my-0">
        <FinanceTab data={tabData.finance || { 
          monthlyBudget: [], 
          cashFlow: [], 
          kpis: [], 
          totalBudget: 0, 
          totalSpent: 0, 
          forecastAccuracy: 0 
        }} loading={loading} />
      </TabsContent>

      <TabsContent value="projects" className="w-full h-full overflow-auto p-4 m-0">
        <ProjectsTab data={tabData.projects || { 
          criticalProjects: [], 
          delayedMilestones: [], 
          summary: { totalProjects: 0, onTrack: 0, atRisk: 0, delayed: 0, completionRate: 0 }, 
          aiAdvice: [] 
        }} loading={loading} />
      </TabsContent>

      <TabsContent value="marketing" className="w-full h-full overflow-auto p-4 m-0">
        <MarketingTab data={tabData.marketing || { 
          roasData: [], 
          campaigns: [], 
          attribution: [], 
          kpis: [], 
          totalROAS: 0, 
          totalSpent: 0, 
          totalRevenue: 0 
        }} loading={loading} />
      </TabsContent>
      
      <TabsContent value="hr" className="w-full h-full overflow-auto p-4 m-0">
        <HRTab data={tabData.hr || { 
          resourceUtilization: [], 
          skillGaps: [], 
          stats: { 
            totalEmployees: 0, 
            activeProjects: 0, 
            avgUtilization: 0, 
            skillGaps: 0, 
            performanceScore: 0, 
            retentionRate: 0,
            active: 0,
            onLeave: 0,
            vacancies: 0
          }, 
          workloadBalance: [] 
        }} loading={loading} />
      </TabsContent>
      
      <TabsContent value="clients" className="w-full h-full overflow-auto p-4 m-0">
        <ClientsTab data={tabData.clients || { 
          opportunityFunnel: [], 
          npsScores: [], 
          portfolioHealth: { totalClients: 0, activeContracts: 0, renewalRate: 0, churnRate: 0, avgContractValue: 0, clientSatisfaction: 0 }, 
          sentimentData: [] 
        }} loading={loading} />
      </TabsContent>
      
      <TabsContent value="reports" className="w-full h-full overflow-auto p-4 m-0">
        <ReportsTab data={tabData.reports || { 
          templates: [], 
          statistics: { totalReports: 0, monthlyDownloads: 0, customReports: 0, scheduledReports: 0, popularCategories: [] }, 
          aiSuggestions: [] 
        }} loading={loading} />
      </TabsContent>
    </>;
};
