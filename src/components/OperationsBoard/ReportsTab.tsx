
import React from 'react';
import { TemplatesList } from './Reports/TemplatesList';
import { CustomReportForm } from './Reports/CustomReportForm';

interface ReportTemplate {
  id: number;
  name: string;
}

export interface ReportsData {
  templates: ReportTemplate[];
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
    <div className="space-y-6 h-full">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-gray-800 mb-1">التقارير</h2>
        <p className="text-gray-600 text-sm">تقارير مفصلة وإحصائيات</p>
      </div>
      
      <TemplatesList templates={data.templates} />
      <CustomReportForm />
    </div>
  );
};
