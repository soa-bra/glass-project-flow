
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import OverviewTab from './OverviewTab';
import FinanceTab from './FinanceTab';
import LegalTab from './LegalTab';
import HRTab from './HRTab';
import ClientsTab from './ClientsTab';
import ReportsTab from './ReportsTab';

export const TabContentWrapper = ({ tabData, loading }: { tabData: any; loading: boolean }) => {
  return (
    <>
      <TabsContent value="overview" className="w-full h-full overflow-auto p-6">
        <OverviewTab data={tabData} loading={loading} />
      </TabsContent>
      
      <TabsContent value="finance" className="w-full h-full overflow-auto p-6">
        <FinanceTab data={tabData} loading={loading} />
      </TabsContent>
      
      <TabsContent value="legal" className="w-full h-full overflow-auto p-6">
        <LegalTab data={tabData} loading={loading} />
      </TabsContent>
      
      <TabsContent value="hr" className="w-full h-full overflow-auto p-6">
        <HRTab data={tabData} loading={loading} />
      </TabsContent>
      
      <TabsContent value="clients" className="w-full h-full overflow-auto p-6">
        <ClientsTab data={tabData} loading={loading} />
      </TabsContent>
      
      <TabsContent value="reports" className="w-full h-full overflow-auto p-6">
        <ReportsTab data={tabData} loading={loading} />
      </TabsContent>
    </>
  );
};
