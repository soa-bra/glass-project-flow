import React from 'react';
import { StatisticsCard } from './StatisticsCard';
import { FinancialOverviewCard } from './FinancialOverviewCard';
import { ProjectSummaryCard } from './ProjectSummaryCard';
import { AlertsCard } from './AlertsCard';
import { HRWidget } from './HRWidget';
import { MarketingWidget } from './MarketingWidget';
import { ReportsWidget } from './ReportsWidget';
import { CustomersWidget } from './CustomersWidget';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Layers, Cpu } from 'lucide-react';
export const OverviewGrid: React.FC = () => {
  // Mock data for the new widgets
  const mockHRData = {
    members: 24,
    vacancies: 3,
    onLeave: 2
  };
  const mockMarketingData = {
    roas: 4.2,
    activeCampaigns: 8,
    conversion: 12
  };
  const mockReportsData = {
    totalReports: 15,
    pendingReports: 4,
    completedReports: 11
  };
  const mockCustomersData = {
    totalClients: 45,
    newClients: 6,
    satisfaction: 92
  };
  return <div className="grid grid-cols-4 grid-rows-4 gap-[10px] h-[calc(53vh)] min-h-0 overflow-hidden py-px my-0">
      {/* الصف الأول */}
      <div className="row-span-3 h-full min-h-0">
        <FinancialOverviewCard />
      </div>
      
      <StatisticsCard title="بيانات" value="46" unit="مليار" description="هذا النص مثال للشكل البياني" chartType="bar" />

      <StatisticsCard title="بيانات" value="17" unit="مليار" description="هذا النص مثال للشكل البياني" chartType="line" />

      <CustomersWidget customers={mockCustomersData} />

      {/* الصف الثاني */}
      <StatisticsCard title="نسبة" value="75" unit="مئوية" description="هذا النص مثال للشكل البياني" chartType="simple" />

      <AlertsCard />

      <StatisticsCard title="معدل" value="85" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />

      {/* الصف الثالث */}
      <div className="col-span-2 h-full min-h-0">
        <ProjectSummaryCard />
      </div>

      <StatisticsCard title="أداء" value="78" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />

      {/* الصف الرابع - الكاردات الجديدة */}
      <HRWidget hr={mockHRData} />
      
      <MarketingWidget marketing={mockMarketingData} />
      
      <ReportsWidget reports={mockReportsData} />

      <StatisticsCard title="جودة" value="96" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />

    </div>;
};