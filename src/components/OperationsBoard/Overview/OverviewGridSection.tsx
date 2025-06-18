
import React from 'react';
import { TimelineWidget } from './TimelineWidget';
import { AlertsPanel } from './AlertsPanel';
import { ProjectSummaryPanel } from './ProjectSummaryPanel';
import { FinancialOverviewChart } from './FinancialOverviewChart';
import { DataVisualizationPanel } from './DataVisualizationPanel';
import { OverviewData } from './OverviewData';

interface OverviewGridSectionProps {
  data: OverviewData;
}

export const OverviewGridSection: React.FC<OverviewGridSectionProps> = ({
  data
}) => {
  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* الجدول الزمني - يأخذ 8 أعمدة */}
      <div className="col-span-8 h-full">
        <div className="h-full p-4 rounded-lg bg-white/40 backdrop-blur-sm">
          <TimelineWidget timeline={data.timeline} />
        </div>
      </div>

      {/* التنبيهات - يأخذ 4 أعمدة */}
      <div className="col-span-4 h-full">
        <AlertsPanel alerts={data.alerts} />
      </div>

      {/* ملخص المشاريع - يأخذ 6 أعمدة */}
      <div className="col-span-6 h-full">
        <ProjectSummaryPanel projects={data.projects} />
      </div>

      {/* الرسم البياني المالي - يأخذ 3 أعمدة */}
      <div className="col-span-3 h-full">
        <FinancialOverviewChart data={data.financial} />
      </div>

      {/* لوحة تصور البيانات - يأخذ 3 أعمدة */}
      <div className="col-span-3 h-full">
        <DataVisualizationPanel 
          title="إحصائيات الأداء"
          value={92}
          description="نسبة الإنجاز الإجمالية"
          chart="circle"
        />
      </div>
    </div>
  );
};
