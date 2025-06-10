import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { OverviewTab } from './OverviewTab';
import { FinanceTab } from './FinanceTab';
import { LegalTab } from './LegalTab';
import { HRTab } from './HRTab';
import { ClientsTab } from './ClientsTab';
import { ReportsTab } from './ReportsTab';
import { TabData } from './types';
interface TabContentWrapperProps {
  tabData: TabData;
  loading: boolean;
}
export const TabContentWrapper: React.FC<TabContentWrapperProps> = ({
  tabData,
  loading
}) => {
  return <div className="flex-1 overflow-y-auto p-6 px-[10px] py-[5px]">
      <TabsContent value="overview" className="space-y-4 h-full animate-in fade-in-0 slide-in-from-bottom-5 data-[state=inactive]:animate-out">
        <OverviewTab data={tabData.overview} loading={loading} />
      </TabsContent>

      <TabsContent value="finance" className="space-y-4 h-full animate-in fade-in-0 slide-in-from-bottom-5 data-[state=inactive]:animate-out">
        <FinanceTab data={tabData.finance} loading={loading} />
      </TabsContent>

      <TabsContent value="legal" className="space-y-4 h-full animate-in fade-in-0 slide-in-from-bottom-5 data-[state=inactive]:animate-out">
        <LegalTab data={tabData.legal} loading={loading} />
      </TabsContent>

      <TabsContent value="hr" className="space-y-4 h-full animate-in fade-in-0 slide-in-from-bottom-5 data-[state=inactive]:animate-out">
        <HRTab data={tabData.hr} loading={loading} />
      </TabsContent>

      <TabsContent value="clients" className="space-y-4 h-full animate-in fade-in-0 slide-in-from-bottom-5 data-[state=inactive]:animate-out">
        <ClientsTab data={tabData.clients} loading={loading} />
      </TabsContent>

      <TabsContent value="reports" className="space-y-4 h-full animate-in fade-in-0 slide-in-from-bottom-5 data-[state=inactive]:animate-out">
        <ReportsTab data={tabData.reports} loading={loading} />
      </TabsContent>
    </div>;
};