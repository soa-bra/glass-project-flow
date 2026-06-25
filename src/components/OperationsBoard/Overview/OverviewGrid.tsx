import React from 'react';
import { Stagger } from '@/components/shared/motion';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import {
  StatisticsBox,
  FinancialOverviewBox,
  ProjectSummaryBox,
  AlertsBox,
  HRBox,
  MarketingBox,
  ReportsBox,
  CustomersBox
} from './index';

export const OverviewGrid: React.FC = () => {
  // تم مسح بيانات الموظفين الوهمية — تعرض الكبسولة أصفارًا حتى ربطها ببيانات حقيقية.
  const mockHRData = { members: 0, vacancies: 0, onLeave: 0 };
  const mockMarketingData = { roas: 4.2, activeCampaigns: 8, conversion: 12 };
  const mockReportsData = { totalReports: 15, pendingReports: 4, completedReports: 11 };
  const mockCustomersData = { totalClients: 45, newClients: 6, satisfaction: 92 };

  return (
    <Stagger delay={0.3} gap={0.12} className="min-h-0 overflow-hidden py-px my-0">
      <AppDashboardGrid
        columns={12}
        density="default"
        autoFlow="dense"
        minRowHeight="120px"
        className="items-stretch"
      >

        {/* الصف الأول والثاني: الصناديق القيادية موزعة على عرض اللوحة بدون فراغات */}
        <AppGridItem colSpan={4} tabletSpan={3} rowSpan={2} minHeight="250px">
          <Stagger.Item className="h-full min-h-0">
            <FinancialOverviewBox />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={4} tabletSpan={3} minHeight="120px">
          <Stagger.Item className="h-full">
            <StatisticsBox title="بيانات" value="46" unit="مليار" description="هذا النص مثال للشكل البياني" chartType="bar" />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={4} tabletSpan={3} rowSpan={2} minHeight="250px">
          <Stagger.Item className="h-full min-h-0">
            <AlertsBox />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={2} tabletSpan={3} minHeight="120px">
          <Stagger.Item className="h-full">
            <StatisticsBox title="نسبة" value="75" unit="مئوية" description="هذا النص مثال للشكل البياني" chartType="simple" />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={2} tabletSpan={3} minHeight="120px">
          <Stagger.Item className="h-full">
            <CustomersBox customers={mockCustomersData} />
          </Stagger.Item>
        </AppGridItem>

        {/* الصف الثالث والرابع: ملخص المشاريع وصندوق الأداء بارتفاع متوازن */}
        <AppGridItem colSpan={4} tabletSpan={3} rowSpan={2} minHeight="250px">
          <Stagger.Item className="h-full min-h-0">
            <StatisticsBox title="أداء" value="78" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="bar" />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={8} tabletSpan={6} rowSpan={2} minHeight="250px">
          <Stagger.Item className="h-full min-h-0">
            <ProjectSummaryBox />
          </Stagger.Item>
        </AppGridItem>

        {/* الصف الأخير: أربعة صناديق متساوية */}
        <AppGridItem colSpan={3} tabletSpan={3} minHeight="120px">
          <Stagger.Item className="h-full">
            <HRBox hr={mockHRData} />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3} minHeight="120px">
          <Stagger.Item className="h-full">
            <MarketingBox marketing={mockMarketingData} />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3} minHeight="120px">
          <Stagger.Item className="h-full">
            <ReportsBox reports={mockReportsData} />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3} minHeight="120px">
          <Stagger.Item className="h-full">
            <StatisticsBox title="جودة" value="96" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />
          </Stagger.Item>
        </AppGridItem>

      </AppDashboardGrid>
    </Stagger>
  );
};
