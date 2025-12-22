import React from 'react';
import { Stagger } from '@/components/shared/motion';
import { StatisticsBox } from './StatisticsBox';
import { FinancialOverviewBox } from './FinancialOverviewBox';
import { ProjectSummaryBox } from './ProjectSummaryBox';
import { AlertsBox } from './AlertsBox';
import { HRBox } from './HRBox';
import { MarketingBox } from './MarketingBox';
import { ReportsBox } from './ReportsBox';
import { CustomersBox } from './CustomersBox';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
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
    <Stagger delay={0.3} gap={0.12} className="grid grid-cols-4 grid-rows-4 gap-[10px] h-[calc(53vh)] min-h-0 overflow-hidden py-px my-0">
      {/* الصف الأول */}
      <Stagger.Item className="row-span-3 h-full min-h-0">
        <FinancialOverviewBox />
      </Stagger.Item>
      
      <Stagger.Item>
        <StatisticsBox title="بيانات" value="46" unit="مليار" description="هذا النص مثال للشكل البياني" chartType="bar" />
      </Stagger.Item>

      <Stagger.Item>
        <StatisticsBox title="بيانات" value="17" unit="مليار" description="هذا النص مثال للشكل البياني" chartType="line" />
      </Stagger.Item>

      <Stagger.Item className="row-span-2 h-full min-h-0">
        <AlertsBox />
      </Stagger.Item>

      {/* الصف الثاني */}
      <Stagger.Item>
        <StatisticsBox title="نسبة" value="75" unit="مئوية" description="هذا النص مثال للشكل البياني" chartType="simple" />
      </Stagger.Item>

      <Stagger.Item>
        <CustomersBox customers={mockCustomersData} />
      </Stagger.Item>

      {/* الصف الثالث */}
      <Stagger.Item className="col-span-2 h-full min-h-0">
        <ProjectSummaryBox />
      </Stagger.Item>

      <Stagger.Item>
        <StatisticsBox title="أداء" value="78" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />
      </Stagger.Item>

      {/* الصف الرابع - الكاردات الجديدة */}
      <Stagger.Item>
        <HRBox hr={mockHRData} />
      </Stagger.Item>
      
      <Stagger.Item>
        <MarketingBox marketing={mockMarketingData} />
      </Stagger.Item>
      
      <Stagger.Item>
        <ReportsBox reports={mockReportsData} />
      </Stagger.Item>

      <Stagger.Item>
        <StatisticsBox title="جودة" value="96" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />
      </Stagger.Item>

    </Stagger>
  );
};