import React, { useMemo, useState, useEffect } from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { UserPlus, Calendar, Award, Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { HrEmployees } from '@/hooks/departments';
import { mockHRStats, mockWorkforceAnalytics } from './data';

const STORAGE_KEY = 'hr.dataSource.useRealData';

export const OverviewTab: React.FC = () => {
  const [useRealData, setUseRealData] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(useRealData));
  }, [useRealData]);

  const { data: employees = [], isLoading } = HrEmployees.useList();

  // Derive live stats + analytics from Supabase data
  const live = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'active').length;
    const onLeave = employees.filter((e) => e.status === 'on_leave').length;
    const inactive = employees.filter((e) => e.status === 'inactive').length;

    const deptCounts = new Map<string, number>();
    employees.forEach((e) => {
      const meta = (e.metadata ?? {}) as Record<string, unknown>;
      const label = (meta.department_label as string | undefined) ?? 'غير محدد';
      deptCounts.set(label, (deptCounts.get(label) ?? 0) + 1);
    });
    const departmentDistribution = Array.from(deptCounts.entries()).map(([department, count]) => ({
      department,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
    }));

    const attendanceRate = total ? Math.round((active / total) * 100) : 0;

    return {
      stats: {
        totalEmployees: total,
        activeEmployees: active,
        onLeave,
        inactive,
        attendanceRate,
      },
      analytics: {
        departmentDistribution,
        skillsGaps: [] as Array<{ skill: string; currentLevel: number; requiredLevel: number; gap: number }>,
      },
    };
  }, [employees]);

  const stats = useRealData ? live.stats : { ...mockHRStats };
  const analytics = useRealData ? live.analytics : mockWorkforceAnalytics;

  const kpiStats = [
    { title: 'إجمالي الموظفين', value: stats.totalEmployees, unit: 'موظف', description: 'العدد الكلي للموظفين' },
    { title: 'الموظفون النشطون', value: stats.activeEmployees, unit: 'نشط', description: 'الموظفون الحاضرون اليوم' },
    { title: 'معدل الحضور', value: `${stats.attendanceRate}%`, unit: 'حضور', description: 'نسبة الحضور الشهرية' },
  ];

  const quickActions = [
    { icon: UserPlus, label: 'إضافة موظف جديد', color: '#a4e2f6' },
    { icon: Calendar, label: 'مراجعة طلبات الإجازة', color: '#bdeed3' },
    { icon: Award, label: 'إجراء تقييم أداء', color: '#d9d2fd' },
    { icon: Users, label: 'إدارة التوظيف', color: '#fbe2aa' },
  ];

  const isEmpty = useRealData && !isLoading && employees.length === 0;

  return (
    <div className="space-y-5 bg-transparent">
      {/* Data source toggle */}
      <AppCardSurface density="standard">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
              مصدر البيانات
            </span>
            <span className="text-[13px] text-[rgba(11,15,18,0.70)] font-arabic mt-1">
              {useRealData
                ? 'يتم عرض بيانات الموظفين الحقيقية من قاعدة البيانات (hr_employees).'
                : 'يتم عرض بيانات تجريبية للعرض فقط.'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="hr-real-data" className="text-[12px] font-arabic text-[rgba(11,15,18,0.70)]">
              {useRealData ? 'بيانات حقيقية' : 'بيانات تجريبية'}
            </Label>
            <Switch id="hr-real-data" checked={useRealData} onCheckedChange={setUseRealData} />
          </div>
        </div>
        {isEmpty && (
          <div className="mt-3 rounded-[14px] border border-dashed border-[#DADCE0] p-3 text-[12px] font-arabic text-[rgba(11,15,18,0.60)]">
            لا يوجد موظفون مسجلون بعد. أضف الموظف الأول من تبويب «ملفات الموظفين» لتظهر البيانات الحقيقية هنا.
          </div>
        )}
      </AppCardSurface>

      <KPIStatsSection stats={kpiStats} />

      {/* Quick Actions */}
      <AppCardSurface density="standard">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
          الإجراءات السريعة
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="h-20 flex flex-col items-center justify-center gap-2 rounded-[18px] border border-[#DADCE0] hover:border-[rgba(11,15,18,0.2)] transition-colors"
            >
              <action.icon className="h-5 w-5" style={{ color: action.color }} />
              <span className="text-[11px] font-arabic text-[rgba(11,15,18,0.60)]">{action.label}</span>
            </button>
          ))}
        </div>
      </AppCardSurface>

      {/* Workforce Distribution */}
      <AppCardSurface density="standard">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
          توزيع القوى العاملة
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h4 className="text-[12px] font-medium mb-3 font-arabic text-[rgba(11,15,18,0.60)]">التوزيع حسب القسم</h4>
            {analytics.departmentDistribution.length === 0 ? (
              <p className="text-[11px] font-arabic text-[rgba(11,15,18,0.40)]">لا توجد بيانات.</p>
            ) : (
              <div className="space-y-2.5">
                {analytics.departmentDistribution.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-[11px] font-arabic text-[rgba(11,15,18,0.60)]">{dept.department}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[rgba(11,15,18,0.04)] rounded-full">
                        <div className="h-2 rounded-full" style={{ width: `${dept.percentage}%`, backgroundColor: '#a4e2f6' }} />
                      </div>
                      <span className="text-[11px] font-bold text-[#0B0F12] w-6 text-left">{dept.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-[12px] font-medium mb-3 font-arabic text-[rgba(11,15,18,0.60)]">فجوات المهارات</h4>
            {analytics.skillsGaps.length === 0 ? (
              <p className="text-[11px] font-arabic text-[rgba(11,15,18,0.40)]">لا توجد بيانات.</p>
            ) : (
              <div className="space-y-2.5">
                {analytics.skillsGaps.map((skill, index) => (
                  <div key={index} className="p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-arabic font-medium text-[rgba(11,15,18,0.70)]">{skill.skill}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(241,181,185,0.15)] text-[rgba(11,15,18,0.60)] font-arabic">فجوة {skill.gap.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-[rgba(11,15,18,0.40)]">
                      <span>الحالي: {skill.currentLevel}</span>
                      <span>المطلوب: {skill.requiredLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AppCardSurface>
    </div>
  );
};
