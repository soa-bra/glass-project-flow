
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
    <div className="flex-1 grid gap-4 p-4" style={{
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'auto auto auto'
    }}>
      <div style={{ gridColumn: '1 / 4', gridRow: '1' }}>
        <TimelineWidget timeline={data.timeline} />
      </div>
      
      <div style={{ gridColumn: '4', gridRow: '1' }}>
        <DataVisualizationPanel 
          title="البيانات" 
          value={75} 
          description="نسبة الإنجاز"
          chart="circle"
        />
      </div>

      <div style={{ gridColumn: '1', gridRow: '2' }}>
        <AlertsPanel alerts={data.alerts} />
      </div>

      <div style={{ gridColumn: '2', gridRow: '2' }}>
        <ProjectSummaryPanel projects={data.projects} />
      </div>

      <div style={{ gridColumn: '3 / 5', gridRow: '2' }}>
        <FinancialOverviewChart 
          title="النظرة المالية العامة"
          data={data.financial}
          isProfit={true}
        />
      </div>

      <div style={{ gridColumn: '1 / 3', gridRow: '3' }}>
        <DataVisualizationPanel 
          title="الأداء الشهري" 
          value={85} 
          description="معدل النمو"
          chart="bar"
        />
      </div>

      <div style={{ gridColumn: '3 / 5', gridRow: '3' }}>
        <DataVisualizationPanel 
          title="اتجاه المبيعات" 
          value={92} 
          description="نسبة التحسن"
          chart="line"
        />
      </div>
    </div>
  );
};
