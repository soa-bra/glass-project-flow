
import React from 'react';
import { TemplatesList } from './Reports/TemplatesList';
import { CustomReportForm } from './Reports/CustomReportForm';

interface ReportTemplate {
  id: number;
  name: string;
}

interface ReportsData {
  templates: ReportTemplate[];
}

interface ReportsTabProps {
  data?: ReportsData;
  loading: boolean;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-arabic font-medium text-right">التقارير</h2>
      
      <TemplatesList templates={data.templates} />
      <CustomReportForm />
    </div>
  );
};
