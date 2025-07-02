
import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { TopCategoriesCard } from './components/TopCategoriesCard';
import { AIRecommendationsCard } from './components/AIRecommendationsCard';
import { KnowledgeGapsCard } from './components/KnowledgeGapsCard';
import { RecentActivityCard } from './components/RecentActivityCard';
import { mockKnowledgeMetrics } from './data/mockData';

export const OverviewTab: React.FC = () => {
  const metrics = mockKnowledgeMetrics;

  const kpiStats = [
    {
      title: 'إجمالي الوثائق',
      value: metrics.totalDocuments,
      unit: 'وثيقة',
      description: 'المحتوى المعرفي المتاح'
    },
    {
      title: 'إجمالي القراءات',
      value: metrics.totalReads.toLocaleString(),
      unit: 'قراءة',
      description: 'مرات الوصول للمحتوى'
    },
    {
      title: 'المستخدمون النشطون',
      value: metrics.activeUsers,
      unit: 'مستخدم',
      description: 'النشاط الشهري للمستخدمين'
    },
    {
      title: 'النمو الشهري',
      value: `+${metrics.monthlyGrowth}`,
      unit: '%',
      description: 'معدل نمو استخدام المحتوى'
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <TopCategoriesCard />

        {/* AI Recommendations */}
        <AIRecommendationsCard />
      </div>

      {/* Knowledge Gaps */}
      <KnowledgeGapsCard />

      {/* Recent Activity */}
      <RecentActivityCard />
    </div>
  );
};
