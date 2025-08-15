
import React from 'react';
import { ReportLibrary, ReportStats } from './Reports/ReportLibrary';
import { CustomReportWizard } from './Reports/CustomReportWizard';
import { AIReportGenerator } from './Reports/AIReportGenerator';
import { BaseOperationsTabLayout } from './BaseOperationsTabLayout';

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
  // تحويل البيانات إلى تنسيق KPI
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
        <div className="space-y-6">
          {/* الأدوات الأساسية */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ReportLibrary templates={data.templates} />
            <CustomReportWizard />
          </div>
          
          {/* مولد التقارير الذكي */}
          <AIReportGenerator suggestions={data.aiSuggestions} />
        </div>
      )}
    </BaseOperationsTabLayout>
  );
};
