import React, { useMemo } from 'react';
import { FileText, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricHeroCard } from '@/components/shared/visual-data';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';
import { useProjectMetrics } from '@/hooks/useProjectMetrics';

interface ReportsTabProps {
  project: { id: string; title?: string };
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ project }) => {
  const { tasks, transactions, budgetTotals, taskStats, loading } = useProjectMetrics(project.id);

  const reports = useMemo(() => {
    const list: Array<{ id: string; name: string; type: string; date: string; meta: string; icon: any; color: string }> = [];
    if (taskStats.total > 0) {
      list.push({
        id: 'progress',
        name: 'تقرير تقدم المهام',
        type: 'progress',
        date: new Date().toLocaleDateString('ar-SA'),
        meta: `${taskStats.done}/${taskStats.total} منجزة (${taskStats.completionRate}%)`,
        icon: BarChart3,
        color: '#f1b5b9',
      });
    }
    if (budgetTotals.planned > 0) {
      list.push({
        id: 'finance',
        name: 'التقرير المالي',
        type: 'finance',
        date: new Date().toLocaleDateString('ar-SA'),
        meta: `صُرف ${Math.round(budgetTotals.spent).toLocaleString()} من ${Math.round(budgetTotals.planned).toLocaleString()}`,
        icon: PieChart,
        color: '#a4e2f6',
      });
    }
    if (transactions.length > 0) {
      list.push({
        id: 'transactions',
        name: 'سجل المعاملات المالية',
        type: 'transactions',
        date: transactions[0]?.date || new Date().toISOString().slice(0, 10),
        meta: `${transactions.length} معاملة مسجلة`,
        icon: TrendingUp,
        color: '#d9d2fd',
      });
    }
    return list;
  }, [tasks.length, transactions, budgetTotals, taskStats]);

  const stats = {
    totalReports: reports.length,
    tasksTracked: taskStats.total,
    transactionsTracked: transactions.length,
    completionRate: taskStats.completionRate,
  };

  const typeCounts = {
    progress: taskStats.total,
    finance: budgetTotals.planned > 0 ? 1 : 0,
    team: taskStats.inProgress,
    transactions: transactions.length,
  };

  return (
    <div className="space-y-6">
      <AppCardSurface density="standard">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">مركز التقارير</h3>
          <div className="bg-[#bdeed3] px-4 py-1.5 rounded-full">
            <span className="text-[11px] font-medium text-[#0B0F12]">{loading ? 'جاري التحميل' : 'محدّث'}</span>
          </div>
        </div>
        <p className="text-sm text-[rgba(11,15,18,0.6)]">تقارير مُولّدة آلياً من بيانات المشروع المحفوظة في Supabase</p>
      </AppCardSurface>

      <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
        <AppGridItem colSpan={3} tabletSpan={3}>
          <MetricHeroCard title="التقارير المتاحة" value={String(stats.totalReports)} unit="تقرير" badgeText="حيّة" badgeColor="#bdeed3" />
        </AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={3}>
          <MetricHeroCard title="المهام المتتبّعة" value={String(stats.tasksTracked)} unit="مهمة" badgeText="من قاعدة البيانات" badgeColor="#a4e2f6" />
        </AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={3}>
          <MetricHeroCard title="المعاملات المالية" value={String(stats.transactionsTracked)} unit="معاملة" badgeText="مسجّلة" badgeColor="#d9d2fd" />
        </AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={3}>
          <MetricHeroCard title="معدل الإنجاز" value={`${stats.completionRate}%`} badgeText="حالي" badgeColor="#fbe2aa" />
        </AppGridItem>
      </AppDashboardGrid>

      <AppCardSurface density="standard">
        <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide mb-5">أنواع التقارير</h3>
        <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
          {[
            { icon: BarChart3, label: 'تقارير التقدم', count: typeCounts.progress, color: '#f1b5b9' },
            { icon: PieChart, label: 'التقارير المالية', count: typeCounts.finance, color: '#a4e2f6' },
            { icon: TrendingUp, label: 'تقارير الفريق', count: typeCounts.team, color: '#d9d2fd' },
            { icon: FileText, label: 'سجل المعاملات', count: typeCounts.transactions, color: '#fbe2aa' },
          ].map((item, i) => (
            <AppGridItem key={i} colSpan={3} tabletSpan={3}>
              <div className="text-center p-5 rounded-[18px] ring-1 ring-[rgba(11,15,18,0.08)] h-full">
                <item.icon className="w-5 h-5 mx-auto mb-3 text-[#0B0F12]" />
                <div className="text-[28px] font-bold text-[#0B0F12] mb-1">{item.count}</div>
                <div className="text-[11px] text-[rgba(11,15,18,0.6)] mb-2">{item.label}</div>
                <div className="inline-block px-3 py-1 rounded-full" style={{ backgroundColor: item.color }}>
                  <span className="text-[10px] font-medium text-[#0B0F12]">{item.count} عنصر</span>
                </div>
              </div>
            </AppGridItem>
          ))}
        </AppDashboardGrid>
      </AppCardSurface>

      <AppCardSurface density="standard">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">التقارير المتاحة</h3>
          <Button className="bg-[#0B0F12] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[rgba(11,15,18,0.85)]">
            إنشاء تقرير جديد
          </Button>
        </div>
        <div className="space-y-3">
          {loading ? (
            <div className="py-10 text-center text-sm text-[rgba(11,15,18,0.55)]">جاري تحميل البيانات…</div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <FileText className="w-8 h-8 text-[rgba(11,15,18,0.25)] mb-2" />
              <div className="text-sm text-[rgba(11,15,18,0.55)]">لا توجد بيانات كافية لتوليد تقارير بعد.</div>
            </div>
          ) : reports.map(report => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="rounded-[18px] ring-1 ring-[rgba(11,15,18,0.08)] p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: report.color }}>
                    <Icon className="w-4 h-4 text-[#0B0F12]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0B0F12]">{report.name}</div>
                    <div className="text-[11px] text-[rgba(11,15,18,0.6)]">{report.meta}</div>
                  </div>
                </div>
                <div className="text-[11px] text-[rgba(11,15,18,0.5)]">{report.date}</div>
              </div>
            );
          })}
        </div>
      </AppCardSurface>
    </div>
  );
};
