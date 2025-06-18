import React from 'react';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';
interface FinancialOverviewChartProps {
  title: string;
  data: {
    total: number;
    segments: {
      label: string;
      value: number;
      color: string;
    }[];
  };
  isProfit?: boolean;
}
export const FinancialOverviewChart: React.FC<FinancialOverviewChartProps> = ({
  title,
  data,
  isProfit = true
}) => {
  const backgroundColor = isProfit ? '#96d8d0' : '#f1b5b9';
  return;
};