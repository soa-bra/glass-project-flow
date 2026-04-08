import React from 'react';
import { CapsuleBarChart } from '@/components/shared/visual-data';

interface CriticalProject {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  priority: 'high' | 'medium' | 'low';
}

interface MiniGanttChartProps {
  criticalProjects: CriticalProject[];
}

export const MiniGanttChart: React.FC<MiniGanttChartProps> = ({ criticalProjects }) => {
  const chartData = criticalProjects.slice(0, 10).map(p => ({
    label: p.name.length > 15 ? p.name.substring(0, 15) + '…' : p.name,
    value: p.progress,
  }));

  return (
    <CapsuleBarChart
      title="أعلى المشاريع الحرجة"
      data={chartData}
      color="#0B0F12"
      maxValue={100}
      showValues
      valueFormatter={(v) => `${v}%`}
    />
  );
};
