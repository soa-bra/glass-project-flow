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
  const mockHRData = { members: 24, vacancies: 3, onLeave: 2 };
  const mockMarketingData = { roas: 4.2, activeCampaigns: 8, conversion: 12 };
  const mockReportsData = { totalReports: 15, pendingReports: 4, completedReports: 11 };
  const mockCustomersData = { totalClients: 45, newClients: 6, satisfaction: 92 };

  return (
    <Stagger delay={0.3} gap={0.12} className="h-[calc(53vh)] min-h-0 overflow-hidden py-px my-0">
      <AppDashboardGrid columns={12} density="default" viewportHeight="100%">

        {/* العمود الأيمن: النظرة المالية — 3 أعمدة × 3 صفوف */}
        <AppGridItem colSpan={3} tabletSpan={3} rowSpan={3}>
          <Stagger.Item className="h-full min-h-0">
            <FinancialOverviewBox />
          </Stagger.Item>
        </AppGridItem>

        {/* الصف الأول — بطاقتا إحصاء + التنبيهات */}
        <AppGridItem colSpan={3} tabletSpan={3}>
          <Stagger.Item>
            <StatisticsBox title="بيانات" value="46" unit="مليار" description="هذا النص مثال للشكل البياني" chartType="bar" />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3}>
          <Stagger.Item>
            <StatisticsBox title="بيانات" value="17" unit="مليار" description="هذا النص مثال للشكل البياني" chartType="line" />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3} rowSpan={2}>
          <Stagger.Item className="h-full min-h-0">
            <AlertsBox />
          </Stagger.Item>
        </AppGridItem>

        {/* الصف الثاني — نسبة + عملاء */}
        <AppGridItem colSpan={3} tabletSpan={3}>
          <Stagger.Item>
            <StatisticsBox title="نسبة" value="75" unit="مئوية" description="هذا النص مثال للشكل البياني" chartType="simple" />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3}>
          <Stagger.Item>
            <CustomersBox customers={mockCustomersData} />
          </Stagger.Item>
        </AppGridItem>

        {/* الصف الثالث — ملخص المشاريع + أداء */}
        <AppGridItem colSpan={6} tabletSpan={6}>
          <Stagger.Item className="h-full min-h-0">
            <ProjectSummaryBox />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3}>
          <Stagger.Item>
            <StatisticsBox title="أداء" value="78" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />
          </Stagger.Item>
        </AppGridItem>

        {/* الصف الرابع — HR + تسويق + تقارير + جودة */}
        <AppGridItem colSpan={3} tabletSpan={3}>
          <Stagger.Item>
            <HRBox hr={mockHRData} />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3}>
          <Stagger.Item>
            <MarketingBox marketing={mockMarketingData} />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3}>
          <Stagger.Item>
            <ReportsBox reports={mockReportsData} />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3}>
          <Stagger.Item>
            <StatisticsBox title="جودة" value="96" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />
          </Stagger.Item>
        </AppGridItem>

      </AppDashboardGrid>
    </Stagger>
  );
};
