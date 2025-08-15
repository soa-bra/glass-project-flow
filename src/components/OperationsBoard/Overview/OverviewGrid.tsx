import React from 'react';
import { SoaMotion } from '@/components/ui';
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
  return (
    <SoaMotion delay={0.3} className="grid grid-cols-4 grid-rows-4 gap-3 h-[calc(53vh)] min-h-0 overflow-hidden py-px my-0">
      {/* الصف الأول */}
      <SoaMotion delay={0.32} className="row-span-3 h-full min-h-0">
        <FinancialOverviewCard />
      </SoaMotion>
      
      <SoaMotion delay={0.34}>
        <StatisticsCard title="بيانات" value="46" unit="مليار" description="هذا النص مثال للشكل البياني" chartType="bar" />
      </SoaMotion>

      <SoaMotion delay={0.36}>
        <StatisticsCard title="بيانات" value="17" unit="مليار" description="هذا النص مثال للشكل البياني" chartType="line" />
      </SoaMotion>

      <SoaMotion delay={0.38}>
        <StatisticsCard title="معدل" value="85" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />
      </SoaMotion>

      {/* الصف الثاني */}
      <SoaMotion delay={0.40}>
        <StatisticsCard title="نسبة" value="75" unit="مئوية" description="هذا النص مثال للشكل البياني" chartType="simple" />
      </SoaMotion>

      <SoaMotion delay={0.42}>
        <CustomersWidget customers={mockCustomersData} />
      </SoaMotion>

      <SoaMotion delay={0.44}>
        <AlertsCard />
      </SoaMotion>

      {/* الصف الثالث */}
      <SoaMotion delay={0.46} className="col-span-2 h-full min-h-0">
        <ProjectSummaryCard />
      </SoaMotion>

      <SoaMotion delay={0.48}>
        <StatisticsCard title="أداء" value="78" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />
      </SoaMotion>

      {/* الصف الرابع - الكاردات الجديدة */}
      <SoaMotion delay={0.50}>
        <HRWidget hr={mockHRData} />
      </SoaMotion>
      
      <SoaMotion delay={0.52}>
        <MarketingWidget marketing={mockMarketingData} />
      </SoaMotion>
      
      <SoaMotion delay={0.54}>
        <ReportsWidget reports={mockReportsData} />
      </SoaMotion>

      <SoaMotion delay={0.56}>
        <StatisticsCard title="جودة" value="96" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />
      </SoaMotion>

    </SoaMotion>
  );
};