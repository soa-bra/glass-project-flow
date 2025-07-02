
import React from 'react';
import { ReportLibrary, ReportStats } from './Reports/ReportLibrary';
import { CustomReportWizard } from './Reports/CustomReportWizard';
import { AIReportGenerator } from './Reports/AIReportGenerator';

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

  return (
    <div className="space-y-6 h-full overflow-auto">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-gray-800 mb-1">التقارير</h2>
        <p className="text-gray-600 text-sm">إخراج تقارير تنفيذية أو تفصيلية عند الطلب</p>
      </div>
      
      {/* إحصائيات التقارير */}
      <ReportStats statistics={data.statistics} />
      
      {/* الأدوات الأساسية */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ReportLibrary templates={data.templates} />
        <CustomReportWizard />
      </div>
      
      {/* مولد التقارير الذكي */}
      <AIReportGenerator suggestions={data.aiSuggestions} />
    </div>
  );
};
