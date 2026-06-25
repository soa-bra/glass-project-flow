
import React from 'react';
import { ReportLibrary, ReportStats } from './Reports/ReportLibrary';
import { CustomReportWizard } from './Reports/CustomReportWizard';
import { AIReportGenerator } from './Reports/AIReportGenerator';
import { BaseOperationsTabLayout } from './BaseOperationsTabLayout';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';

interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  format: 'PDF' | 'PowerBI' | 'Excel' | 'Dashboard';
  lastUpdated: string;
  downloadCount: number;
  tags: string[];
}

interface ReportStatistics {
  totalReports: number;
  monthlyDownloads: number;
  customReports: number;
  scheduledReports: number;
  popularCategories: { category: string; count: number }[];
}

interface AIReportSuggestion {
  id: string;
  title: string;
  description: string;
  confidence: number;
  dataPoints: string[];
  estimatedTime: string;
}

export interface ReportsData {
  templates: ReportTemplate[];
  statistics: ReportStatistics;
  aiSuggestions: AIReportSuggestion[];
}

interface ReportsTabProps {
  data?: ReportsData;
  loading: boolean;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ data, loading }) => {
  const kpiStats = data ? [{
    title: "إجمالي التقارير",
    value: String(data.statistics.totalReports),
    unit: "تقرير",
    description: "تقارير متاحة في المكتبة"
  }, {
    title: "التحميلات الشهرية",
    value: String(data.statistics.monthlyDownloads),
    unit: "تحميل",
    description: "مرات التحميل هذا الشهر"
  }, {
    title: "التقارير المخصصة",
    value: String(data.statistics.customReports),
    unit: "تقرير",
    description: "تقارير مصممة خصيصاً"
  }, {
    title: "التقارير المجدولة",
    value: String(data.statistics.scheduledReports),
    unit: "تقرير",
    description: "تقارير تلقائية مجدولة"
  }] : [];

  return (
    <BaseOperationsTabLayout
      value="reports"
      kpiStats={kpiStats}
      loading={loading}
      error={!data && !loading ? "لا توجد بيانات تقارير متاحة" : undefined}
    >
      {data && (
        <AppDashboardGrid
          columns={12}
          density="default"
          minRowHeight="160px"
          className="items-stretch"
        >
          <AppGridItem colSpan={7} tabletSpan={6} rowSpan={3} minHeight="420px">
            <ReportLibrary templates={data.templates} />
          </AppGridItem>

          <AppGridItem colSpan={5} tabletSpan={6} rowSpan={3} minHeight="420px">
            <CustomReportWizard />
          </AppGridItem>

          <AppGridItem colSpan={12} tabletSpan={6} minHeight="280px">
            <AIReportGenerator suggestions={data.aiSuggestions} />
          </AppGridItem>
        </AppDashboardGrid>
      )}
    </BaseOperationsTabLayout>
  );
};
