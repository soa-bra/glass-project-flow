
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { OverviewTab } from './OverviewTab';
import { FinanceTab } from './FinanceTab';
import { ProjectsTab } from './ProjectsTab';
import { MarketingTab } from './MarketingTab';
import { ClientsTab } from './ClientsTab';
import { ReportsTab } from './ReportsTab';

export const TabContentWrapper = ({
  tabData,
  loading
}: {
  tabData: any;
  loading: boolean;
}) => {
  // تم تحسين حواف الحاوية والظل لجعل الإحساس الزجاجي أكثر وضوحاً خاصة أعلى وأسفل كل تاب
  return (
    <>
      <TabsContent value="overview" className="w-full h-full overflow-auto p-0 m-0 px-0 py-[8px]">
        <OverviewTab data={tabData.overview} loading={loading} />
      </TabsContent>
      <TabsContent value="finance" className="w-full h-full overflow-auto p-0 m-0 px-0 py-[8px]">
        <FinanceTab data={tabData.finance} loading={loading} />
      </TabsContent>
      <TabsContent value="projects" className="w-full h-full overflow-auto p-0 m-0 px-0 py-[8px]">
        <ProjectsTab data={tabData.projects} loading={loading} />
      </TabsContent>
      <TabsContent value="marketing" className="w-full h-full overflow-auto p-0 m-0 px-0 py-[8px]">
        <MarketingTab data={tabData.marketing} loading={loading} />
      </TabsContent>
      <TabsContent value="clients" className="w-full h-full overflow-auto p-0 m-0 px-0 py-[8px]">
        <ClientsTab data={tabData.clients} loading={loading} />
      </TabsContent>
      <TabsContent value="reports" className="w-full h-full overflow-auto p-0 m-0 px-0 py-[8px]">
        <ReportsTab data={tabData.reports} loading={loading} />
      </TabsContent>
    </>
  );
};
