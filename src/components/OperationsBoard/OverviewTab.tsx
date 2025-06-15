
import React from 'react';
import { TimelineWidget } from './Overview/TimelineWidget';
import { BudgetOverviewWidget } from './Overview/BudgetOverviewWidget';
import { TasksSummaryWidget } from './Overview/TasksSummaryWidget';
import { PerformanceChartWidget } from './Overview/PerformanceChartWidget';
import { SparklineWidget } from './Overview/SparklineWidget';
import { AICardWidget } from './Overview/AICardWidget';
import { AlertsWidget } from './Overview/AlertsWidget';
import { ProjectsSummaryWidget } from './Overview/ProjectsSummaryWidget';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  department: string;
  color: string;
}

interface WidgetsData {
  // This might need adjustments later based on new data structure
  budget: {
    total: number;
    spent: number;
  };
  contracts: {
    signed: number;
    expired: number;
  };
  hr: {
    members: number;
    vacancies: number;
    onLeave: number;
  };
  satisfaction: number;
}

interface OverviewData {
  timeline: TimelineEvent[];
  widgets: WidgetsData;
}

interface OverviewTabProps {
  data?: OverviewData;
  loading: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  loading
}) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }
  return (
    <div className="h-full overflow-auto px-4">
      <div className="w-full pt-2.5 pb-7 flex flex-col gap-6">
        {/* Timeline */}
        <TimelineWidget
          timeline={data.timeline}
          className="h-[220px]"
        />

        {/* 3x3 Grid */}
        <section 
          className="grid grid-cols-3 grid-rows-[repeat(2,minmax(0,1fr))_auto] gap-6"
          style={{
            gridTemplateAreas: `
              "budget tasks_summary perf_chart"
              "budget sparkline_small ai_card"
              "alerts alerts projects_summary"
            `,
          }}
        >
          <BudgetOverviewWidget className="[grid-area:budget]" />
          <TasksSummaryWidget className="[grid-area:tasks_summary]" />
          <PerformanceChartWidget className="[grid-area:perf_chart]" />
          <SparklineWidget className="[grid-area:sparkline_small]" />
          <AICardWidget className="[grid-area:ai_card]" />
          <AlertsWidget className="[grid-area:alerts]" />
          <ProjectsSummaryWidget className="[grid-area:projects_summary]" />
        </section>
      </div>
    </div>
  );
};
