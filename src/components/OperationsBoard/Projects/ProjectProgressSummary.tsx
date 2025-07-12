
import React from 'react';

interface ProjectSummary {
  totalProjects: number;
  onTrack: number;
  atRisk: number;
  delayed: number;
  completionRate: number;
}

interface ProjectProgressSummaryProps {
  summary: ProjectSummary;
}

export const ProjectProgressSummary: React.FC<ProjectProgressSummaryProps> = ({ summary }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'onTrack':
        return '#bdeed3'; // أخضر للمشاريع المنجزة
      case 'atRisk':
        return '#fbe2aa'; // أصفر للمشاريع المعرضة للخطر
      case 'delayed':
        return '#f1b5b9'; // أحمر للمشاريع المتأخرة
      default:
        return '#d0e0e2'; // اللون الأساسي
    }
  };

  const stats = [
    { label: 'إجمالي المشاريع', value: summary.totalProjects, type: 'total' },
    { label: 'في المسار', value: summary.onTrack, type: 'onTrack' },
    { label: 'معرض للخطر', value: summary.atRisk, type: 'atRisk' },
    { label: 'متأخر', value: summary.delayed, type: 'delayed' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="p-6 rounded-3xl border border-black/10 text-center"
          style={{ 
            backgroundColor: stat.type === 'total' ? '#d0e0e2' : getStatusColor(stat.type)
          }}
        >
          <div className="text-2xl font-bold text-black font-arabic mb-1">{stat.value}</div>
          <div className="text-sm font-bold text-black font-arabic">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
