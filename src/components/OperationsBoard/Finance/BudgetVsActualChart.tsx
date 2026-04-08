import React from 'react';
import { CapsuleBarChart } from '@/components/shared/visual-data/CapsuleBarChart';

interface MonthlyBudget {
  month: string;
  budget: number;
  actual: number;
  variance: number;
}

interface BudgetVsActualChartProps {
  monthlyData: MonthlyBudget[];
}

export const BudgetVsActualChart: React.FC<BudgetVsActualChartProps> = ({ monthlyData }) => {
  // Use a paired capsule bar approach - two bars per month
  const barData = monthlyData.map(d => ({
    label: d.month,
    value: d.actual,
    target: d.budget,
  }));

  return (
    <CapsuleBarChart
      title="الميزانية مقابل الإنفاق الفعلي"
      data={barData}
      color="#a4e2f6"
      trackColor="rgba(189,238,211,0.5)"
      className="w-full"
      barWidth={18}
      showLabels
    />
  );
};
