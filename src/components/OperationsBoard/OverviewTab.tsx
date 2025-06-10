
import React from 'react';
import { TimelineSection } from './Overview/TimelineSection';
import { BudgetWidget } from './Overview/BudgetWidget';
import { ContractsWidget } from './Overview/ContractsWidget';
import { HRWidget } from './Overview/HRWidget';
import { SatisfactionWidget } from './Overview/SatisfactionWidget';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  department: string;
  color: string;
}

interface WidgetsData {
  budget: { total: number; spent: number };
  contracts: { signed: number; expired: number };
  hr: { members: number; vacancies: number; onLeave: number };
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

export const OverviewTab: React.FC<OverviewTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center">جارٍ التحميل...</div>;
  }

  return (
    <div className="flex h-full gap-6">
      <TimelineSection timeline={data.timeline} />

      <div className="flex-1 grid grid-cols-2 gap-4">
        <BudgetWidget budget={data.widgets.budget} />
        <ContractsWidget contracts={data.widgets.contracts} />
        <HRWidget hr={data.widgets.hr} />
        <SatisfactionWidget satisfaction={data.widgets.satisfaction} />
      </div>
    </div>
  );
};
