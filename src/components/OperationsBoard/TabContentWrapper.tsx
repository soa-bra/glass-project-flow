
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

export const TabContentWrapper = ({
  tabData,
  loading
}: {
  tabData: any;
  loading: boolean;
}) => {
  return (
    <>
      <TabsContent value="overview" className="w-full h-full overflow-auto p-4 m-0 px-0 py-[10px]">
        <OverviewTab data={tabData.overview} loading={loading} />
      </TabsContent>
      <TabsContent value="finance" className="w-full h-full overflow-auto p-4 m-0">
        <FinanceTab data={tabData.finance} loading={loading} />
      </TabsContent>
      <TabsContent value="projects" className="w-full h-full overflow-auto p-4 m-0">
        <ProjectsTab data={tabData.projects} loading={loading} />
      </TabsContent>
      <TabsContent value="marketing" className="w-full h-full overflow-auto p-4 m-0">
        <MarketingTab data={tabData.marketing} loading={loading} />
      </TabsContent>
      <TabsContent value="clients" className="w-full h-full overflow-auto p-4 m-0">
        <ClientsTab data={tabData.clients} loading={loading} />
      </TabsContent>
      <TabsContent value="reports" className="w-full h-full overflow-auto p-4 m-0">
        <ReportsTab data={tabData.reports} loading={loading} />
      </TabsContent>
    </>
  );
};
