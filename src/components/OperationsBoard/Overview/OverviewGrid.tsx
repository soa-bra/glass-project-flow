
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

  return (
    <div className="grid grid-cols-4 gap-[10px] py-0 my-0 h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] min-h-0 overflow-hidden">
      <div className="col-span-4 grid grid-cols-4 gap-[10px] h-1/4 min-h-0">
        <FinancialOverviewCard />
        
        <StatisticsCard 
          title="بيانات" 
          value="46" 
          unit="مليار" 
          description="هذا النص مثال للشكل البياني" 
          chartType="bar"
        />

        <StatisticsCard 
          title="بيانات" 
          value="17" 
          unit="مليار" 
          description="هذا النص مثال للشكل البياني" 
          chartType="line" 
        />

        <CustomersWidget customers={mockCustomersData} />
      </div>

      <div className="col-span-4 grid grid-cols-4 gap-[10px] h-1/4 min-h-0">
        <StatisticsCard 
          title="نسبة" 
          value="75" 
          unit="مئوية" 
          description="هذا النص مثال للشكل البياني" 
          chartType="simple"
        />

        <AlertsCard />

        <StatisticsCard 
          title="معدل" 
          value="85" 
          unit="نسبة" 
          description="هذا النص مثال للشكل البياني" 
          chartType="simple"
        />

        <StatisticsCard 
          title="تقييم" 
          value="92" 
          unit="نقطة" 
          description="هذا النص مثال للشكل البياني" 
          chartType="simple"
        />
      </div>

      <div className="col-span-4 grid grid-cols-4 gap-[10px] h-1/4 min-h-0">
        <div className="col-span-2 h-full min-h-0">
          <ProjectSummaryCard />
        </div>

        <StatisticsCard 
          title="أداء" 
          value="78" 
          unit="نسبة" 
          description="هذا النص مثال للشكل البياني" 
          chartType="simple"
        />

        <StatisticsCard 
          title="جودة" 
          value="96" 
          unit="نسبة" 
          description="هذا النص مثال للشكل البياني" 
          chartType="simple"
        />
      </div>

      <div className="col-span-4 grid grid-cols-4 gap-[10px] h-1/4 min-h-0">
        <HRWidget hr={mockHRData} />
        
        <MarketingWidget marketing={mockMarketingData} />
        
        <ReportsWidget reports={mockReportsData} />

        <div className="flex items-center justify-center">
          <div className="text-gray-400 text-sm">مساحة إضافية</div>
        </div>
      </div>

    </div>
  );
};
