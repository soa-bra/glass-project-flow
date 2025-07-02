
import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { CulturalHealthCard } from './components/CulturalHealthCard';
import { RecentActivitiesCard } from './components/RecentActivitiesCard';
import { PerformanceInsightsCard } from './components/PerformanceInsightsCard';
import { AIInsightsCard } from './components/AIInsightsCard';

export const OverviewTab: React.FC = () => {
  const culturalHarmonyIndex = 87;
  const identityHealthScore = 92;
  const brandAwarenessScore = 78;
  const culturalImpactScore = 85;

  const kpiStats = [
    {
      title: 'مؤشر الانسجام الثقافي',
      value: culturalHarmonyIndex,
      unit: '%',
      description: 'مستوى التوافق مع القيم الجوهرية'
    },
    {
      title: 'صحة الهوية',
      value: identityHealthScore,
      unit: '%',
      description: 'تماسك الهوية البصرية والثقافية'
    },
    {
      title: 'الوعي بالعلامة',
      value: brandAwarenessScore,
      unit: '%',
      description: 'مستوى الإدراك والتميز'
    },
    {
      title: 'الأثر الثقافي',
      value: culturalImpactScore,
      unit: '%',
      description: 'قوة التأثير في المجتمع'
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cultural Identity Health */}
        <CulturalHealthCard />

        {/* Recent Activities */}
        <RecentActivitiesCard />
      </div>

      {/* Brand Performance Insights */}
      <PerformanceInsightsCard />

      {/* AI-Powered Insights */}
      <AIInsightsCard />
    </div>
  );
};
