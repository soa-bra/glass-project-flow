import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { OverviewTab } from './OverviewTab';
import { FinanceTab } from './FinanceTab';
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
  return <>
      <TabsContent value="overview" className="w-full h-full overflow-auto p-2m-0 data-[state=active]:flex data-[state=active]:flex-col px-[10px] py-0">
        <OverviewTab data={tabData.overview} loading={loading} />
      </TabsContent>
      
      <TabsContent value="finance" className="w-full h-full overflow-auto p-4 m-0">
        <FinanceTab data={tabData.finance} loading={loading} />
      </TabsContent>
      
      <TabsContent value="legal" className="w-full h-full overflow-auto p-4 m-0">
        <LegalTab data={tabData.legal} loading={loading} />
      </TabsContent>
      
      <TabsContent value="hr" className="w-full h-full overflow-auto p-4 m-0">
        <HRTab data={tabData.hr} loading={loading} />
      </TabsContent>
      
      <TabsContent value="clients" className="w-full h-full overflow-auto p-4 m-0">
        <ClientsTab data={tabData.clients} loading={loading} />
      </TabsContent>
      
      <TabsContent value="reports" className="w-full h-full overflow-auto p-4 m-0">
        <ReportsTab data={tabData.reports} loading={loading} />
      </TabsContent>
    </>;
};