import React from 'react';
import { AlertTriangle, FileText, Shield, TrendingUp, Bell, CheckCircle, Clock } from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { NumericStatCard } from '@/components/shared/visual-data';
import { BaseBox, BaseListItem } from '@/components/shared';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { mockLegalMetrics, mockAlerts } from './data';
import { SPACING, LAYOUT } from '@/components/shared/design-system/constants';

export const OverviewTab: React.FC = () => {
  const metrics = mockLegalMetrics;
  const alerts = mockAlerts.filter(alert => alert.status === 'pending').slice(0, 5);
  
  const kpiStats = [
    {
      title: 'العقود الموقعة',
      value: metrics.contractsCount.signed,
      unit: 'عقد',
      description: 'عقود نشطة ومعتمدة'
    },
    {
      title: 'القضايا النشطة',
      value: metrics.activeCases,
      unit: 'قضية',
      description: 'قضايا تحتاج متابعة'
    },
    {
      title: 'درجة الامتثال',
      value: `${metrics.complianceScore}%`,
      unit: 'امتثال',
      description: 'مستوى الامتثال القانوني'
    },
    {
      title: 'المخاطر المحلولة',
      value: '15',
      unit: 'خطر',
      description: 'تم حلها هذا الشهر'
    }
  ];

  const getBadgeVariant = (priority: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'info';
    }
  };

  return <div className={`space-y-6 ${SPACING.SECTION_MARGIN}`}>
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />
      
      <AppDashboardGrid columns={12} density="spacious">
        <AppGridItem colSpan={6} tabletSpan={6}>
        {/* إحصائيات العقود */}
        <BaseBox
          title="توزيع العقود حسب الحالة"
          icon={<FileText className={LAYOUT.ICON_SIZE} />}
        >
          <div className="grid grid-cols-2 gap-3">
            <NumericStatCard title="موقعة" value={metrics.contractsCount.signed} size="sm" />
            <NumericStatCard title="في الانتظار" value={metrics.contractsCount.pending} size="sm" />
            <NumericStatCard title="منتهية" value={metrics.contractsCount.expired} size="sm" />
            <NumericStatCard title="قيد المراجعة" value={metrics.contractsCount.underReview} size="sm" />
          </div>
        </BaseBox>
        </AppGridItem>

        <AppGridItem colSpan={6} tabletSpan={6}>
        {/* درجة الامتثال ومؤشرات المخاطر */}
        <BaseBox 
          title="مؤشرات الامتثال والمخاطر"
          icon={<Shield className={LAYOUT.ICON_SIZE} />}
        >
          <div className="space-y-4">
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="text-4xl font-bold text-black font-arabic mb-2">{metrics.complianceScore}%</div>
              <div className="text-sm font-medium text-black font-arabic">درجة الامتثال</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-[#bdeed3] h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${metrics.complianceScore}%` }}
                />
              </div>
            </div>
            <div className="text-center p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="text-2xl font-bold text-black font-arabic mb-2">{metrics.riskScore}</div>
              <div className="text-sm font-medium text-black font-arabic">درجة المخاطر الإجمالية</div>
            </div>
          </div>
        </BaseBox>
        </AppGridItem>
      </AppDashboardGrid>

      <AppDashboardGrid columns={12} density="spacious">
        <AppGridItem colSpan={6} tabletSpan={6}>
        {/* الإحصائيات الشهرية */}
        <BaseBox
          title="الإنجازات الشهرية"
          icon={<TrendingUp className={LAYOUT.ICON_SIZE} />}
        >
          <div className="grid grid-cols-2 gap-3">
            <NumericStatCard title="عقد موقع" value={metrics.monthlyStats.contractsSigned} size="sm" />
            <NumericStatCard title="قضية محلولة" value={metrics.monthlyStats.casesResolved} size="sm" />
            <NumericStatCard title="فحص امتثال" value={metrics.monthlyStats.complianceChecks} size="sm" />
            <NumericStatCard title="تقييم مخاطر" value={metrics.monthlyStats.riskAssessments} size="sm" />
          </div>
        </BaseBox>
        </AppGridItem>

        <AppGridItem colSpan={6} tabletSpan={6}>
        {/* التنبيهات القانونية */}
        <BaseBox 
          title="تنبيهات قانونية عاجلة"
          icon={<Bell className={LAYOUT.ICON_SIZE} />}
        >
          <div className="space-y-3">
            {alerts.map(alert => (
              <BaseListItem
                key={alert.id}
                icon={
                  alert.priority === 'high' ? <AlertTriangle className={LAYOUT.ICON_SIZE} /> :
                  alert.priority === 'medium' ? <Clock className={LAYOUT.ICON_SIZE} /> :
                  <CheckCircle className={LAYOUT.ICON_SIZE} />
                }
                badge={{
                  text: alert.priority === 'high' ? 'عالي' : alert.priority === 'medium' ? 'متوسط' : 'منخفض',
                  variant: getBadgeVariant(alert.priority)
                }}
              >
                {alert.message}
              </BaseListItem>
            ))}
          </div>
        </BaseBox>
        </AppGridItem>
      </AppDashboardGrid>
    </div>;
};
