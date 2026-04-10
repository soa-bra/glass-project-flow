import React from 'react';
import { Eye, Users, FileText, Clock, TrendingUp, AlertTriangle, Calendar, Award, Settings, BarChart, Globe, Shield, Database, Zap } from 'lucide-react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';

interface DepartmentOverviewProps {
  departmentTitle: string;
}

interface StatItem {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ElementType;
}

const StatCard: React.FC<{ stat: StatItem }> = ({ stat }) => (
  <div className="bg-white p-6 rounded-[24px] border border-[#DADCE0] text-center">
    <div className="flex items-center justify-between mb-3">
      <stat.icon className="h-6 w-6 text-[#0B0F12]" />
      <div className={`px-3 py-1 rounded-full text-xs font-normal ${
        stat.trend === 'up' ? 'bg-[#bdeed3] text-[#0B0F12]' : 'bg-[#f1b5b9] text-[#0B0F12]'
      }`}>
        {stat.change > 0 ? '+' : ''}{stat.change}%
      </div>
    </div>
    <h3 className="text-2xl font-bold text-[#0B0F12] mb-1 font-arabic">{stat.value}</h3>
    <p className="text-sm font-normal text-[rgba(11,15,18,0.6)] font-arabic">{stat.title}</p>
  </div>
);

export const GeneralOverviewTab: React.FC<DepartmentOverviewProps> = ({ departmentTitle }) => {
  const kpiStats = [
    { title: 'المهام النشطة', value: 24, unit: 'مهمة', description: 'المهام الجارية حالياً' },
    { title: 'أعضاء الفريق', value: 12, unit: 'عضو', description: 'أعضاء الفريق النشطون' },
    { title: 'معدل الإنجاز', value: '87%', unit: 'إنجاز', description: 'نسبة إنجاز المهام' }
  ];

  const departmentStats: StatItem[] = [
    { title: 'المهام النشطة', value: '24', change: 8.5, trend: 'up', icon: FileText },
    { title: 'أعضاء الفريق', value: '12', change: 2.1, trend: 'up', icon: Users },
    { title: 'معدل الإنجاز', value: '87%', change: 5.3, trend: 'up', icon: TrendingUp },
    { title: 'المهام المتأخرة', value: '3', change: -12.5, trend: 'down', icon: Clock },
  ];

  const additionalStats: StatItem[] = [
    { title: 'الاجتماعات المجدولة', value: '8', change: 15.2, trend: 'up', icon: Calendar },
    { title: 'المشاريع المميزة', value: '5', change: 10.0, trend: 'up', icon: Award },
    { title: 'الإعدادات المحدثة', value: '2', change: -5.0, trend: 'down', icon: Settings },
    { title: 'التقارير الشهرية', value: '15', change: 8.7, trend: 'up', icon: BarChart },
  ];

  const fifthRowStats: StatItem[] = [
    { title: 'الشبكات المتصلة', value: '12', change: 18.3, trend: 'up', icon: Globe },
    { title: 'مستوى الأمان', value: '96%', change: 4.2, trend: 'up', icon: Shield },
    { title: 'قواعد البيانات', value: '7', change: 12.8, trend: 'up', icon: Database },
    { title: 'الأداء المحسن', value: '94%', change: 6.5, trend: 'up', icon: Zap },
  ];

  const recentActivities = [
    { action: 'تم إكمال مهمة المراجعة المالية', time: 'منذ ساعتين', priority: 'high' as const },
    { action: 'إضافة عضو جديد للفريق', time: 'منذ 4 ساعات', priority: 'medium' as const },
    { action: 'تحديث تقرير الأداء الشهري', time: 'منذ يوم واحد', priority: 'low' as const },
    { action: 'مراجعة الميزانية المعتمدة', time: 'منذ يومين', priority: 'high' as const },
  ];

  const upcomingTasks = [
    { task: 'اجتماع المراجعة الأسبوعية', dueDate: 'غداً - 10:00 ص', progress: 0 },
    { task: 'إعداد التقرير الشهري', dueDate: 'خلال 3 أيام', progress: 45 },
    { task: 'مراجعة الخطة الاستراتيجية', dueDate: 'خلال أسبوع', progress: 75 },
  ];

  const getPriorityBadge = (priority: string) => {
    const map: Record<string, { bg: string; label: string }> = {
      high: { bg: 'bg-[#f1b5b9]', label: 'عالي' },
      medium: { bg: 'bg-[#fbe2aa]', label: 'متوسط' },
      low: { bg: 'bg-[#bdeed3]', label: 'منخفض' },
    };
    const { bg, label } = map[priority] || { bg: 'bg-[#a4e2f6]', label: priority };
    return <span className={`${bg} text-[#0B0F12] px-3 py-1 rounded-full text-xs font-normal`}>{label}</span>;
  };

  return (
    <div className="space-y-6">
      <KPIStatsSection stats={kpiStats} />

      {/* إحصائيات الإدارة */}
      <AppDashboardGrid columns={12} density="default">
        {departmentStats.map((stat, i) => (
          <AppGridItem key={i} colSpan={3} tabletSpan={3}>
            <StatCard stat={stat} />
          </AppGridItem>
        ))}
      </AppDashboardGrid>

      {/* الأنشطة + المهام */}
      <AppDashboardGrid columns={12} density="spacious">
        <AppGridItem colSpan={6} tabletSpan={6}>
          <div className="bg-white p-6 rounded-[24px] border border-[#DADCE0] h-full">
            <h3 className="text-lg font-semibold text-[#0B0F12] font-arabic flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5" /> الأنشطة الحديثة
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-[18px] border border-[#DADCE0]">
                  <div className="flex-1">
                    <p className="font-medium font-arabic text-sm text-[#0B0F12]">{activity.action}</p>
                    <p className="text-xs text-[rgba(11,15,18,0.4)]">{activity.time}</p>
                  </div>
                  {getPriorityBadge(activity.priority)}
                </div>
              ))}
            </div>
          </div>
        </AppGridItem>

        <AppGridItem colSpan={6} tabletSpan={6}>
          <div className="bg-white p-6 rounded-[24px] border border-[#DADCE0] h-full">
            <h3 className="text-lg font-semibold text-[#0B0F12] font-arabic flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" /> المهام القادمة
            </h3>
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="p-3 rounded-[18px] border border-[#DADCE0]">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium font-arabic text-sm text-[#0B0F12]">{task.task}</h4>
                    <span className="text-xs text-[rgba(11,15,18,0.4)]">{task.dueDate}</span>
                  </div>
                  {task.progress > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#DADCE0] rounded-full h-2">
                        <div className="bg-[#a4e2f6] h-2 rounded-full" style={{ width: `${task.progress}%` }} />
                      </div>
                      <span className="text-xs text-[rgba(11,15,18,0.4)]">{task.progress}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AppGridItem>
      </AppDashboardGrid>

      {/* التنبيهات */}
      <div className="bg-white p-6 rounded-[24px] border border-[#DADCE0]">
        <h3 className="text-lg font-semibold text-[#0B0F12] font-arabic flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5" /> التنبيهات والملاحظات
        </h3>
        <AppDashboardGrid columns={12} density="default">
          <AppGridItem colSpan={4} tabletSpan={2}>
            <div className="p-4 bg-[#fbe2aa] border border-[#DADCE0] rounded-[18px]">
              <h4 className="font-medium text-[#0B0F12] font-arabic mb-1">تذكير مهم</h4>
              <p className="text-sm text-[#0B0F12]">اجتماع المراجعة الأسبوعية غداً الساعة 10:00 صباحاً</p>
            </div>
          </AppGridItem>
          <AppGridItem colSpan={4} tabletSpan={2}>
            <div className="p-4 bg-[#a4e2f6] border border-[#DADCE0] rounded-[18px]">
              <h4 className="font-medium text-[#0B0F12] font-arabic mb-1">معلومة</h4>
              <p className="text-sm text-[#0B0F12]">تم تحديث نظام إدارة المهام إلى الإصدار الجديد</p>
            </div>
          </AppGridItem>
          <AppGridItem colSpan={4} tabletSpan={2}>
            <div className="p-4 bg-[#bdeed3] border border-[#DADCE0] rounded-[18px]">
              <h4 className="font-medium text-[#0B0F12] font-arabic mb-1">إنجاز</h4>
              <p className="text-sm text-[#0B0F12]">تم تحقيق 90% من أهداف هذا الشهر</p>
            </div>
          </AppGridItem>
        </AppDashboardGrid>
      </div>

      {/* إحصائيات إضافية */}
      <AppDashboardGrid columns={12} density="default">
        {additionalStats.map((stat, i) => (
          <AppGridItem key={i} colSpan={3} tabletSpan={3}>
            <StatCard stat={stat} />
          </AppGridItem>
        ))}
      </AppDashboardGrid>

      <AppDashboardGrid columns={12} density="default">
        {fifthRowStats.map((stat, i) => (
          <AppGridItem key={i} colSpan={3} tabletSpan={3}>
            <StatCard stat={stat} />
          </AppGridItem>
        ))}
      </AppDashboardGrid>
    </div>
  );
};
