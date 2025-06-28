
import React from 'react';
import { ProjectBudgetChart } from './Finance/ProjectBudgetChart';
import { OverBudgetAlert } from './Finance/OverBudgetAlert';
import { ExportButton } from './Finance/ExportButton';

interface ProjectBudget {
  id: number;
  name: string;
  budget: number;
  spent: number;
}

interface OverBudgetProject {
  id: number;
  name: string;
  percentage: number;
}

export interface FinanceData {
  projects: ProjectBudget[];
  overBudget: OverBudgetProject[];
}

interface FinanceTabProps {
  data?: FinanceData;
  loading: boolean;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  return (
    <div className="space-y-6 h-full">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-gray-800 mb-1">المؤشرات المالية</h2>
        <p className="text-gray-600 text-sm">تتبع الميزانيات والمصروفات</p>
      </div>
      
      <ProjectBudgetChart projects={data.projects} />
      <OverBudgetAlert overBudget={data.overBudget} />
      <ExportButton />
    </div>
  );
};
