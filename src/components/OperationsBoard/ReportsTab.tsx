
import React from 'react';
import { ReportLibrary, ReportStats } from './Reports/ReportLibrary';
import { CustomReportWizard } from './Reports/CustomReportWizard';
import { AIReportGenerator } from './Reports/AIReportGenerator';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

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
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  // إعداد بيانات KPI
  const kpiStats = [
    {
      title: "إجمالي التقارير",
      value: data.statistics.totalReports,
      unit: "تقرير"
    },
    {
      title: "التحميلات الشهرية", 
      value: data.statistics.monthlyDownloads,
      unit: "تحميل"
    },
    {
      title: "التقارير المخصصة",
      value: data.statistics.customReports,
      unit: "تقرير"
    },
    {
      title: "التقارير المجدولة",
      value: data.statistics.scheduledReports,
      unit: "تقرير"
    }
  ];

  return (
    <div className="space-y-4 h-full overflow-auto">
      {/* العنوان و KPI في نفس السطر */}
      <div className="flex justify-between items-start px-6 pt-6">
        <div className="text-right">
          <h2 className="text-lg font-semibold text-black font-arabic mb-1">التقارير</h2>
          <p className="text-xs font-normal text-gray-400 font-arabic">إخراج تقارير تنفيذية أو تفصيلية عند الطلب</p>
        </div>
        <KPIStatsSection stats={kpiStats} className="flex-1 max-w-2xl" />
      </div>
      
      {/* الأدوات الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-6">
        <ReportLibrary templates={data.templates} />
        <CustomReportWizard />
      </div>
      
      {/* مولد التقارير الذكي */}
      <div className="px-6">
        <AIReportGenerator suggestions={data.aiSuggestions} />
      </div>
    </div>
  );
};
