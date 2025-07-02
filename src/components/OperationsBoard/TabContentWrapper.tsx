import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { OverviewTab } from './OverviewTab';
import { FinanceTab } from './FinanceTab';
import { ProjectsTab } from './ProjectsTab';
import { MarketingTab } from './MarketingTab';
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
      
      <TabsContent value="finance" className="w-full h-full overflow-auto p-4 m-0">
        <FinanceTab data={tabData.finance || { projects: [], overBudget: [] }} loading={loading} />
      </TabsContent>

      <TabsContent value="projects" className="w-full h-full overflow-auto p-4 m-0">
        <ProjectsTab data={tabData.projects || { gantt: [], milestones: [] }} loading={loading} />
      </TabsContent>

      <TabsContent value="clients" className="w-full h-full overflow-auto p-4 m-0">
        <ClientsTab data={tabData.clients || { active: [], nps: [] }} loading={loading} />
      </TabsContent>

      <TabsContent value="marketing" className="w-full h-full overflow-auto p-4 m-0">
        <MarketingTab data={tabData.marketing || { roas: [], campaigns: [] }} loading={loading} />
      </TabsContent>
      
      <TabsContent value="hr" className="w-full h-full overflow-auto p-4 m-0">
        <HRTab data={tabData.hr || { stats: { active: 0, onLeave: 0, vacancies: 0 }, distribution: [] }} loading={loading} />
      </TabsContent>
      
      <TabsContent value="reports" className="w-full h-full overflow-auto p-4 m-0">
        <ReportsTab data={tabData.reports || { templates: [] }} loading={loading} />
      </TabsContent>
    </>;
};