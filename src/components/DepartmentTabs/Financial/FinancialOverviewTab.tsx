import React from 'react';
import { TrendingUp, DollarSign, CreditCard, Target, AlertTriangle, Calendar, Users, FileText, Award } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface KPI {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
}

interface BudgetAlert {
  project: string;
  percentage: number;
  amount: string;
  severity: 'warning' | 'danger';
}

export const FinancialOverviewTab: React.FC = () => {
  const kpis: KPI[] = [{
    title: 'إجمالي الإيرادات',
    value: '2.4 مليون ريال',
    change: 12.5,
    trend: 'up',
    icon: DollarSign
  }, {
    title: 'صافي الربح',
    value: '486 ألف ريال',
    change: 8.2,
    trend: 'up',
    icon: TrendingUp
  }, {
    title: 'التدفق النقدي',
    value: '320 ألف ريال',
    change: -3.1,
    trend: 'down',
    icon: CreditCard
  }, {
    title: 'نسبة تحقيق الأهداف',
    value: '87%',
    change: 5.4,
    trend: 'up',
    icon: Target
  }];

  const budgetAlerts: BudgetAlert[] = [{
    project: 'مشروع التطوير الرقمي',
    percentage: 92,
    amount: '18,400 ريال',
    severity: 'danger'
  }, {
    project: 'حملة التسويق الصيفية',
    percentage: 85,
    amount: '12,750 ريال',
    severity: 'warning'
  }, {
    project: 'تطوير التطبيق الجوال',
    percentage: 78,
    amount: '9,340 ريال',
    severity: 'warning'
  }];

  const monthlyTrend = [{
    month: 'يناير',
    revenue: 180000,
    expenses: 120000
  }, {
    month: 'فبراير',
    revenue: 210000,
    expenses: 140000
  }, {
    month: 'مارس',
    revenue: 240000,
    expenses: 155000
  }, {
    month: 'أبريل',
    revenue: 220000,
    expenses: 145000
  }, {
    month: 'مايو',
    revenue: 280000,
    expenses: 175000
  }, {
    month: 'يونيو',
    revenue: 320000,
    expenses: 185000
  }];

  // الصف الرابع الجديد - مؤشرات مالية إضافية
  const additionalFinancialKPIs: KPI[] = [{
    title: 'الاجتماعات المالية',
    value: '6',
    change: 20.0,
    trend: 'up',
    icon: Calendar
  }, {
    title: 'العملاء النشطين',
    value: '42',
    change: 7.3,
    trend: 'up',
    icon: Users
  }, {
    title: 'التقارير المعتمدة',
    value: '18',
    change: 12.1,
    trend: 'up',
    icon: FileText
  }, {
    title: 'الإنجازات المالية',
    value: '9',
    change: 25.0,
    trend: 'up',
    icon: Award
  }];

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <BaseCard key={index} variant="glass" size="sm" className="text-center">
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="h-6 w-6 text-blue-600" />
              <Badge variant={kpi.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                {kpi.change > 0 ? '+' : ''}{kpi.change}%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1 font-arabic">{kpi.value}</h3>
            <p className="text-sm text-gray-600 font-arabic">{kpi.title}</p>
          </BaseCard>
        ))}
      </div>

      {/* الرسم البياني للاتجاهات الشهرية */}
      <BaseCard className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-arabic">الاتجاهات المالية الشهرية</h3>
        <div className="space-y-4">
          {monthlyTrend.map((month, index) => {
            const profit = month.revenue - month.expenses;
            const profitMargin = profit / month.revenue * 100;
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium font-arabic">{month.month}</span>
                    <span className="text-sm text-gray-600">
                      هامش الربح: {profitMargin.toFixed(1)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">الإيرادات: {(month.revenue / 1000).toFixed(0)}k</span>
                      <span className="text-red-600">المصروفات: {(month.expenses / 1000).toFixed(0)}k</span>
                    </div>
                    <Progress value={month.expenses / month.revenue * 100} className="h-2" indicatorClassName="bg-gradient-to-r from-green-500 to-red-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </BaseCard>

      {/* تنبيهات الميزانية */}
      <BaseCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">تنبيهات الميزانية</h3>
        </div>
        <div className="space-y-3">
          {budgetAlerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium font-arabic mb-1">{alert.project}</h4>
                <div className="flex items-center gap-2">
                  <Progress value={alert.percentage} className="h-2 flex-1" indicatorClassName={alert.severity === 'danger' ? 'bg-red-500' : 'bg-orange-500'} />
                  <span className="text-sm text-gray-600">{alert.percentage}%</span>
                </div>
              </div>
              <div className="text-left ml-4">
                <Badge variant={alert.severity === 'danger' ? 'destructive' : 'secondary'}>
                  متبقي {alert.amount}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* الذمم المدينة والدائنة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseCard className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 font-arabic">الذمم المدينة</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المبلغ الإجمالي</span>
              <span className="font-bold text-lg">450,000 ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المتأخرة (أكثر من 30 يوم)</span>
              <span className="font-bold text-red-600">85,000 ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المستحقة هذا الشهر</span>
              <span className="font-bold text-orange-500">120,000 ريال</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 font-arabic">الذمم الدائنة</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المبلغ الإجمالي</span>
              <span className="font-bold text-lg">280,000 ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المستحقة هذا الأسبوع</span>
              <span className="font-bold text-red-600">45,000 ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المجدولة هذا الشهر</span>
              <span className="font-bold text-blue-600">95,000 ريال</span>
            </div>
          </div>
        </BaseCard>
      </div>

      {/* الصف الرابع - مؤشرات مالية إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {additionalFinancialKPIs.map((kpi, index) => (
          <BaseCard key={index} variant="operations" size="sm" className="text-center">
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="h-6 w-6 text-blue-600" />
              <Badge variant={kpi.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                {kpi.change > 0 ? '+' : ''}{kpi.change}%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1 font-arabic">{kpi.value}</h3>
            <p className="text-sm text-gray-600 font-arabic">{kpi.title}</p>
          </BaseCard>
        ))}
      </div>
    </div>
  );
};
