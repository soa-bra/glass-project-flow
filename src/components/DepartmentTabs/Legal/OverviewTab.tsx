import React from 'react';
import { AlertTriangle, FileText, Scale, Shield, Calendar, TrendingUp, Bell, CheckCircle, Clock } from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { UnifiedCard } from '@/components/shared/UnifiedCard';
import { UnifiedStatsCard } from '@/components/shared/UnifiedStatsCard';
import { UnifiedListItem } from '@/components/shared/UnifiedListItem';
import { UnifiedBadge } from '@/components/ui/UnifiedBadge';
import { mockLegalMetrics, mockAlerts } from './data';
import { getStatusColor, getStatusText, getPriorityColor } from './utils';
import { SPACING, LAYOUT } from '@/components/shared/design-system/constants';
export const OverviewTab: React.FC = () => {
  const metrics = mockLegalMetrics;
  const alerts = mockAlerts.filter(alert => alert.status === 'pending').slice(0, 5);
  const kpiStats = [{
    title: 'العقود الموقعة',
    value: metrics.contractsCount.signed,
    unit: 'عقد',
    description: 'عقود نشطة ومعتمدة'
  }, {
    title: 'القضايا النشطة',
    value: metrics.activeCases,
    unit: 'قضية',
    description: 'قضايا تحتاج متابعة'
  }, {
    title: 'درجة الامتثال',
    value: `${metrics.complianceScore}%`,
    unit: 'امتثال',
    description: 'مستوى الامتثال القانوني'
  }, {
    title: 'المخاطر المحلولة',
    value: '15',
    unit: 'خطر',
    description: 'تم حلها هذا الشهر'
  }];
  const getBadgeVariant = (priority: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };
  return <div className={`space-y-6 ${SPACING.SECTION_MARGIN}`}>
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />
      
      <div className={LAYOUT.TWO_COLUMN_GRID} style={{
      gap: '1.5rem'
    }}>
        {/* إحصائيات العقود */}
        

        {/* درجة الامتثال ومؤشرات المخاطر */}
        
      </div>

      <div className={LAYOUT.TWO_COLUMN_GRID} style={{
      gap: '1.5rem'
    }}>
        {/* الإحصائيات الشهرية */}
        

        {/* التنبيهات القانونية */}
        
      </div>
    </div>;
};