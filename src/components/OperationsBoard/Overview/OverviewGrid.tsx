
import React from 'react';
import { StatisticsCard } from './StatisticsCard';
import { FinancialOverviewCard } from './FinancialOverviewCard';
import { ProjectSummaryCard } from './ProjectSummaryCard';
import { AlertsCard } from './AlertsCard';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Layers, Cpu } from 'lucide-react';

export const OverviewGrid: React.FC = () => {
  // بيانات الصف الخامس الجديد
  const fifthRowStats = [{
    title: 'الأداء المحسن',
    value: '92%',
    change: 8.4,
    trend: 'up' as const,
    icon: Zap,
    color: 'text-orange-500'
  }, {
    title: 'الأهداف المحققة',
    value: '18',
    change: 15.2,
    trend: 'up' as const,
    icon: Target,
    color: 'text-green-500'
  }, {
    title: 'الطبقات النشطة',
    value: '6',
    change: 12.1,
    trend: 'up' as const,
    icon: Layers,
    color: 'text-blue-500'
  }, {
    title: 'المعالجات',
    value: '4',
    change: 6.7,
    trend: 'up' as const,
    icon: Cpu,
    color: 'text-purple-500'
  }];

  return (
    <div className="grid grid-cols-3 gap-4 py-0 my-0 h-fit items-end">
      {/* الصف الأول */}
      <FinancialOverviewCard />
      
      <StatisticsCard 
        title="بيانات" 
        value="46" 
        unit="مليار" 
        description="هذا النص مثال للشكل البياني" 
        chartType="bar" 
      />

      <StatisticsCard 
        title="بيانات" 
        value="17" 
        unit="مليار" 
        description="هذا النص مثال للشكل البياني" 
        chartType="line" 
      />

      {/* الصف الثاني */}
      <StatisticsCard 
        title="بيانات" 
        value="03" 
        unit="مليار" 
        description="هذا النص مثال للشكل البياني" 
        chartType="line" 
      />

      <StatisticsCard 
        title="نسبة" 
        value="75" 
        unit="مئوية" 
        description="هذا النص مثال للشكل البياني" 
        chartType="simple"
      />

      <AlertsCard />

      {/* الصف الثالث */}
      <div className="col-span-2">
        <ProjectSummaryCard />
      </div>

      <StatisticsCard 
        title="معدل" 
        value="85" 
        unit="نسبة" 
        description="هذا النص مثال للشكل البياني" 
        chartType="simple"
      />

      {/* الصف الرابع */}
      <StatisticsCard 
        title="تحليلات" 
        value="124" 
        unit="تقرير" 
        description="هذا النص مثال للشكل البياني" 
        chartType="bar"
      />

      <StatisticsCard 
        title="عمليات" 
        value="67" 
        unit="مهمة" 
        description="هذا النص مثال للشكل البياني" 
        chartType="line"
      />

      <StatisticsCard 
        title="إنتاجية" 
        value="91" 
        unit="نسبة" 
        description="هذا النص مثال للشكل البياني" 
        chartType="simple"
      />

      {/* الصف الخامس */}
      {fifthRowStats.map((stat, index) => (
        <BaseCard key={index} variant="operations" size="sm" className="text-center">
          <div className="flex items-center justify-between mb-3">
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
            <Badge variant={stat.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
              {stat.change > 0 ? '+' : ''}{stat.change}%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1 font-arabic">{stat.value}</h3>
          <p className="text-sm text-gray-600 font-arabic">{stat.title}</p>
        </BaseCard>
      ))}
    </div>
  );
};
