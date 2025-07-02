
import React from 'react';
import { TrendingUp, DollarSign, CreditCard, Target, AlertTriangle, Calendar, Users, FileText, Award, PieChart, Banknote, Calculator, Briefcase } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

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
  const kpiStats = [
    {
      title: 'إجمالي الإيرادات',
      value: '2.4',
      unit: 'مليون ريال',
      description: 'الإيرادات المحققة هذا الربع'
    },
    {
      title: 'صافي الربح',
      value: '486',
      unit: 'ألف ريال',
      description: 'الربح الصافي بعد المصروفات'
    },
    {
      title: 'التدفق النقدي',
      value: '320',
      unit: 'ألف ريال',
      description: 'السيولة النقدية المتاحة'
    }
  ];

  const kpis: KPI[] = [
    {
      title: 'إجمالي الإيرادات',
      value: '2.4 مليون ريال',
      change: 12.5,
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'صافي الربح',
      value: '486 ألف ريال',
      change: 8.2,
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'التدفق النقدي',
      value: '320 ألف ريال',
      change: -3.1,
      trend: 'down',
      icon: CreditCard
    },
    {
      title: 'نسبة تحقيق الأهداف',
      value: '87%',
      change: 5.4,
      trend: 'up',
      icon: Target
    }
  ];

  const budgetAlerts: BudgetAlert[] = [
    {
      project: 'مشروع التطوير الرقمي',
      percentage: 92,
      amount: '18,400 ريال',
      severity: 'danger'
    },
    {
      project: 'حملة التسويق الصيفية',
      percentage: 85,
      amount: '12,750 ريال',
      severity: 'warning'
    },
    {
      project: 'تطوير التطبيق الجوال',
      percentage: 78,
      amount: '9,340 ريال',
      severity: 'warning'
    }
  ];

  const monthlyTrend = [
    {
      month: 'يناير',
      revenue: 180000,
      expenses: 120000
    },
    {
      month: 'فبراير',
      revenue: 210000,
      expenses: 140000
    },
    {
      month: 'مارس',
      revenue: 240000,
      expenses: 155000
    },
    {
      month: 'أبريل',
      revenue: 220000,
      expenses: 145000
    },
    {
      month: 'مايو',
      revenue: 280000,
      expenses: 175000
    },
    {
      month: 'يونيو',
      revenue: 320000,
      expenses: 185000
    }
  ];

  const additionalFinancialKPIs: KPI[] = [
    {
      title: 'الاجتماعات المالية',
      value: '6',
      change: 20.0,
      trend: 'up',
      icon: Calendar
    },
    {
      title: 'العملاء النشطين',
      value: '42',
      change: 7.3,
      trend: 'up',
      icon: Users
    },
    {
      title: 'التقارير المعتمدة',
      value: '18',
      change: 12.1,
      trend: 'up',
      icon: FileText
    },
    {
      title: 'الإنجازات المالية',
      value: '9',
      change: 25.0,
      trend: 'up',
      icon: Award
    }
  ];

  const fifthRowFinancialKPIs: KPI[] = [
    {
      title: 'التحليلات المالية',
      value: '24',
      change: 16.7,
      trend: 'up',
      icon: PieChart
    },
    {
      title: 'إجمالي الأصول',
      value: '3.2M',
      change: 9.4,
      trend: 'up',
      icon: Banknote
    },
    {
      title: 'العمليات المحاسبية',
      value: '156',
      change: 22.1,
      trend: 'up',
      icon: Calculator
    },
    {
      title: 'المحافظ الاستثمارية',
      value: '8',
      change: 14.3,
      trend: 'up',
      icon: Briefcase
    }
  ];

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="h-6 w-6 text-black" />
              <div className={`px-3 py-1 rounded-full text-xs font-normal ${
                kpi.trend === 'up' ? 'bg-[#bdeed3] text-black' : 'bg-[#f1b5b9] text-black'
              }`}>
                {kpi.change > 0 ? '+' : ''}{kpi.change}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-black mb-1 font-arabic">{kpi.value}</h3>
            <p className="text-sm font-normal text-black font-arabic">{kpi.title}</p>
          </div>
        ))}
      </div>

      {/* الرسم البياني للاتجاهات الشهرية */}
      <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-large font-semibold text-black font-arabic">الاتجاهات المالية الشهرية</h3>
        </div>
        <div className="px-0">
          <div className="space-y-4">
            {monthlyTrend.map((month, index) => {
              const profit = month.revenue - month.expenses;
              const profitMargin = profit / month.revenue * 100;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-transparent border border-black/10 rounded-3xl">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium font-arabic text-black">{month.month}</span>
                      <span className="text-sm text-gray-400">
                        هامش الربح: {profitMargin.toFixed(1)}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-black">الإيرادات: {(month.revenue / 1000).toFixed(0)}k</span>
                        <span className="text-black">المصروفات: {(month.expenses / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#a4e2f6] h-2 rounded-full" 
                          style={{ width: `${month.expenses / month.revenue * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* تنبيهات الميزانية */}
      <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
        <div className="px-0 pt-0 mb-6">
          <h3 className="text-large font-semibold text-black font-arabic flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-black" />
            تنبيهات الميزانية
          </h3>
        </div>
        <div className="px-0">
          <div className="space-y-3">
            {budgetAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-transparent border border-black/10 rounded-3xl">
                <div className="flex-1">
                  <h4 className="font-medium font-arabic text-black mb-1">{alert.project}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${alert.severity === 'danger' ? 'bg-[#f1b5b9]' : 'bg-[#fbe2aa]'}`}
                        style={{ width: `${alert.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400">{alert.percentage}%</span>
                  </div>
                </div>
                <div className="text-left ml-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-normal ${
                    alert.severity === 'danger' ? 'bg-[#f1b5b9] text-black' : 'bg-[#fbe2aa] text-black'
                  }`}>
                    متبقي {alert.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الذمم المدينة والدائنة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <div className="px-0 pt-0 mb-6">
            <h3 className="text-large font-semibold text-black font-arabic">الذمم المدينة</h3>
          </div>
          <div className="px-0">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black">المبلغ الإجمالي</span>
                <span className="font-bold text-lg text-black">450,000 ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">المتأخرة (أكثر من 30 يوم)</span>
                <span className="font-bold text-black">85,000 ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">المستحقة هذا الشهر</span>
                <span className="font-bold text-black">120,000 ريال</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
          <div className="px-0 pt-0 mb-6">
            <h3 className="text-large font-semibold text-black font-arabic">الذمم الدائنة</h3>
          </div>
          <div className="px-0">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black">المبلغ الإجمالي</span>
                <span className="font-bold text-lg text-black">280,000 ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">المستحقة هذا الأسبوع</span>
                <span className="font-bold text-black">45,000 ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">المجدولة هذا الشهر</span>
                <span className="font-bold text-black">95,000 ريال</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الصف الرابع - مؤشرات مالية إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {additionalFinancialKPIs.map((kpi, index) => (
          <div key={index} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="h-6 w-6 text-black" />
              <div className={`px-3 py-1 rounded-full text-xs font-normal ${
                kpi.trend === 'up' ? 'bg-[#bdeed3] text-black' : 'bg-[#f1b5b9] text-black'
              }`}>
                {kpi.change > 0 ? '+' : ''}{kpi.change}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-black mb-1 font-arabic">{kpi.value}</h3>
            <p className="text-sm font-normal text-black font-arabic">{kpi.title}</p>
          </div>
        ))}
      </div>

      {/* الصف الخامس - مؤشرات مالية متقدمة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fifthRowFinancialKPIs.map((kpi, index) => (
          <div key={index} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 text-center">
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className="h-6 w-6 text-black" />
              <div className={`px-3 py-1 rounded-full text-xs font-normal ${
                kpi.trend === 'up' ? 'bg-[#bdeed3] text-black' : 'bg-[#f1b5b9] text-black'
              }`}>
                {kpi.change > 0 ? '+' : ''}{kpi.change}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-black mb-1 font-arabic">{kpi.value}</h3>
            <p className="text-sm font-normal text-black font-arabic">{kpi.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
