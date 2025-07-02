
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Users, BookOpen, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { KirkpatrickMetricsCard } from './components/KirkpatrickMetricsCard';
import { SkillGapAlertsCard } from './components/SkillGapAlertsCard';
import { UpcomingSessionsCard } from './components/UpcomingSessionsCard';
import { RecentEnrollmentsCard } from './components/RecentEnrollmentsCard';
import { mockTrainingMetrics } from './data';

export const OverviewTab: React.FC = () => {
  const metrics = mockTrainingMetrics;

  const kpiStats = [
    {
      title: 'إجمالي الدورات',
      value: metrics.totalCourses,
      unit: 'دورة',
      description: 'الدورات المتاحة حالياً'
    },
    {
      title: 'المتدربون النشطون',
      value: metrics.activeLearners,
      unit: 'متدرب',
      description: 'المتدربون المسجلون حالياً'
    },
    {
      title: 'معدل الإنجاز',
      value: `${metrics.completionRate}%`,
      unit: 'إنجاز',
      description: 'نسبة إكمال الدورات'
    },
    {
      title: 'الشهادات الصادرة',
      value: metrics.certificatesIssued,
      unit: 'شهادة',
      description: 'الشهادات المُصدرة هذا الشهر'
    }
  ];

  const monthlyStats = [
    {
      title: 'التسجيلات الجديدة',
      value: metrics.monthlyStats.newEnrollments,
      icon: TrendingUp,
      color: 'bg-cyan-500'
    },
    {
      title: 'الدورات المكتملة',
      value: metrics.monthlyStats.coursesCompleted,
      icon: BookOpen,
      color: 'bg-emerald-500'
    },
    {
      title: 'الساعات التدريبية',
      value: metrics.totalHoursDelivered,
      icon: Clock,
      color: 'bg-indigo-500'
    },
    {
      title: 'الإيرادات',
      value: `${(metrics.monthlyStats.revenue / 1000).toFixed(0)}k ر.س`,
      icon: DollarSign,
      color: 'bg-rose-500'
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      {/* Monthly Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {monthlyStats.map((stat, index) => (
          <BaseCard key={index} variant="operations" className="p-6 text-center">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-black font-arabic">{stat.value}</div>
            <div className="text-sm text-black font-arabic">{stat.title}</div>
          </BaseCard>
        ))}
      </div>

      {/* Kirkpatrick Metrics */}
      <KirkpatrickMetricsCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Gap Alerts */}
        <SkillGapAlertsCard />

        {/* Upcoming Sessions */}
        <UpcomingSessionsCard />
      </div>

      {/* Recent Enrollments */}
      <RecentEnrollmentsCard />
    </div>
  );
};
