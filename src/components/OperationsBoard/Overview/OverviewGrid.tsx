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
    <Stagger delay={0.3} gap={0.12} className="min-h-0 overflow-hidden py-px my-0">
      <AppDashboardGrid columns={12} density="default" minRowHeight="auto">

        {/* الصف الأول: النظرة المالية (4 أعمدة) + إحصائيات (4) + التنبيهات (4) */}
        <AppGridItem colSpan={4} tabletSpan={3} rowSpan={3} className="min-h-[280px]">
          <Stagger.Item className="h-full min-h-0">
            <FinancialOverviewBox />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={4} tabletSpan={3} className="min-h-[130px]">
          <Stagger.Item className="h-full">
            <StatisticsBox title="بيانات" value="46" unit="مليار" description="هذا النص مثال للشكل البياني" chartType="bar" />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={4} tabletSpan={3} rowSpan={2} className="min-h-[280px]">
          <Stagger.Item className="h-full min-h-0">
            <AlertsBox />
          </Stagger.Item>
        </AppGridItem>

        {/* الصف الثاني: إحصاء + عملاء */}
        <AppGridItem colSpan={2} tabletSpan={3} className="min-h-[130px]">
          <Stagger.Item className="h-full">
            <StatisticsBox title="نسبة" value="75" unit="مئوية" description="هذا النص مثال للشكل البياني" chartType="simple" />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={2} tabletSpan={3} className="min-h-[130px]">
          <Stagger.Item className="h-full">
            <CustomersBox customers={mockCustomersData} />
          </Stagger.Item>
        </AppGridItem>

        {/* الصف الثالث: ملخص المشاريع (6 أعمدة) + أداء (2) */}
        <AppGridItem colSpan={6} tabletSpan={6} className="min-h-[180px]">
          <Stagger.Item className="h-full min-h-0">
            <ProjectSummaryBox />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={2} tabletSpan={3} className="min-h-[130px]">
          <Stagger.Item className="h-full">
            <StatisticsBox title="أداء" value="78" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />
          </Stagger.Item>
        </AppGridItem>

        {/* الصف الرابع: 4 بطاقات × 3 أعمدة */}
        <AppGridItem colSpan={3} tabletSpan={3} className="min-h-[130px]">
          <Stagger.Item className="h-full">
            <HRBox hr={mockHRData} />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3} className="min-h-[130px]">
          <Stagger.Item className="h-full">
            <MarketingBox marketing={mockMarketingData} />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3} className="min-h-[130px]">
          <Stagger.Item className="h-full">
            <ReportsBox reports={mockReportsData} />
          </Stagger.Item>
        </AppGridItem>

        <AppGridItem colSpan={3} tabletSpan={3} className="min-h-[130px]">
          <Stagger.Item className="h-full">
            <StatisticsBox title="جودة" value="96" unit="نسبة" description="هذا النص مثال للشكل البياني" chartType="simple" />
          </Stagger.Item>
        </AppGridItem>

      </AppDashboardGrid>
    </Stagger>
  );
};
