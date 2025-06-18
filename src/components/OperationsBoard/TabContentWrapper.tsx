
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
      <TabsContent value="overview" className="overflow-auto p-0 m-0 px-0 my-0 py-0">
        <OverviewTab data={tabData.overview} loading={loading} />
      </TabsContent>
      
      <TabsContent value="finance" className="w-full h-full overflow-auto p-4 m-0">
        <FinanceTab data={tabData.finance} loading={loading} />
      </TabsContent>

      <TabsContent value="projects" className="w-full h-full overflow-auto p-4 m-0">
        <div className="text-center py-8 text-gray-500 font-arabic">
          محتوى إدارة المشاريع قيد التطوير
        </div>
      </TabsContent>

      <TabsContent value="marketing" className="w-full h-full overflow-auto p-4 m-0">
        <div className="text-center py-8 text-gray-500 font-arabic">
          محتوى التسويق قيد التطوير
        </div>
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
