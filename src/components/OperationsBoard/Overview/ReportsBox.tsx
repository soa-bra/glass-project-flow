import React from 'react';
import { BaseBox } from '@/components/ui/BaseBox';

export interface ReportsData {
  totalReports: number;
  pendingReports: number;
  completedReports: number;
}

export interface ReportsBoxProps {
  reports: ReportsData;
  className?: string;
}

export const ReportsBox: React.FC<ReportsBoxProps> = ({ 
  reports, 
  className = '' 
}) => {
  return (
    <BaseBox 
      title="التقارير"
      variant="unified"
      size="sm"
      rounded="xl"
      className={`h-full min-h-0 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--ink))]">إجمالي التقارير</span>
          <span className="text-xl font-bold text-[hsl(var(--ink))]">{reports.totalReports}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--ink))]">قيد المراجعة</span>
          <span className="text-xl font-bold text-[hsl(var(--ink))]">{reports.pendingReports}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--ink))]">مكتملة</span>
          <span className="text-xl font-bold text-[hsl(var(--ink))]">{reports.completedReports}</span>
        </div>
      </div>
    </BaseBox>
  );
};
