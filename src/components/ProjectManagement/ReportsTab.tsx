import React from 'react';
import { Download, Eye, FileText, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricHeroCard } from '@/components/shared/visual-data';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { AppCardSurface } from '@/components/shared/surfaces/AppCardSurface';

interface ReportsTabProps {
  project: any;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ project }) => {
  const mockReports = [
    { id: '1', name: 'تقرير سير المشروع الشهري', type: 'progress', generatedDate: '2024-01-25', size: '2.1 MB', format: 'PDF', status: 'ready' },
    { id: '2', name: 'تحليل الأداء المالي', type: 'financial', generatedDate: '2024-01-24', size: '1.8 MB', format: 'Excel', status: 'ready' },
    { id: '3', name: 'تقرير كفاءة الفريق', type: 'team', generatedDate: '2024-01-23', size: '1.5 MB', format: 'PDF', status: 'ready' },
    { id: '4', name: 'تقييم رضا العميل', type: 'client', generatedDate: '2024-01-22', size: '1.2 MB', format: 'PDF', status: 'ready' },
  ];

  const reportStats = { totalReports: 15, thisMonth: 4, avgGenTime: '2.3', exportCount: 28 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[24px] bg-[#FFFFFF] ring-1 ring-[#DADCE0] p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">مركز التقارير</h3>
          <div className="bg-[#bdeed3] px-4 py-1.5 rounded-full">
            <span className="text-[11px] font-medium text-[#0B0F12]">محدث</span>
          </div>
        </div>
        <p className="text-sm text-[rgba(11,15,18,0.6)]">جميع التقارير محدثة وجاهزة للتصدير</p>
      </AppCardSurface>

      {/* Stats */}
      <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
        <AppGridItem colSpan={3} tabletSpan={3}>
          <MetricHeroCard title="إجمالي التقارير" value={String(reportStats.totalReports)} unit="تقرير" badgeText="متاح" badgeColor="#bdeed3" />
        </AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={3}>
          <MetricHeroCard title="هذا الشهر" value={String(reportStats.thisMonth)} unit="تقرير" badgeText="جديدة" badgeColor="#a4e2f6" />
        </AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={3}>
          <MetricHeroCard title="متوسط التوليد" value={reportStats.avgGenTime} unit="دقيقة" badgeText="سريع" badgeColor="#d9d2fd" />
        </AppGridItem>
        <AppGridItem colSpan={3} tabletSpan={3}>
          <MetricHeroCard title="مرات التصدير" value={String(reportStats.exportCount)} badgeText="هذا الشهر" badgeColor="#fbe2aa" />
        </AppGridItem>
      </AppDashboardGrid>

      {/* Report Types */}
      <div className="rounded-[24px] bg-[#FFFFFF] ring-1 ring-[#DADCE0] p-6">
        <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide mb-5">أنواع التقارير</h3>
        <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
          {[
            { icon: BarChart3, label: 'تقارير التقدم', count: 5, color: '#f1b5b9' },
            { icon: PieChart, label: 'التقارير المالية', count: 4, color: '#a4e2f6' },
            { icon: TrendingUp, label: 'تقارير الفريق', count: 3, color: '#d9d2fd' },
            { icon: FileText, label: 'تقارير العملاء', count: 3, color: '#fbe2aa' },
          ].map((item, i) => (
            <AppGridItem key={i} colSpan={3} tabletSpan={3}>
              <div className="text-center p-5 rounded-[18px] ring-1 ring-[rgba(11,15,18,0.08)] h-full">
                <item.icon className="w-5 h-5 mx-auto mb-3 text-[#0B0F12]" />
                <div className="text-[28px] font-bold text-[#0B0F12] mb-1">{item.count}</div>
                <div className="text-[11px] text-[rgba(11,15,18,0.6)] mb-2">{item.label}</div>
                <div className="inline-block px-3 py-1 rounded-full" style={{ backgroundColor: item.color }}>
                  <span className="text-[10px] font-medium text-[#0B0F12]">{item.count} تقارير</span>
                </div>
              </div>
            </AppGridItem>
          ))}
        </AppDashboardGrid>
      </AppCardSurface>

      {/* Reports List */}
      <div className="rounded-[24px] bg-[#FFFFFF] ring-1 ring-[#DADCE0] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide">التقارير المتاحة</h3>
          <Button className="bg-[#0B0F12] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[rgba(11,15,18,0.85)]">
            إنشاء تقرير جديد
          </Button>
        </div>
        <div className="space-y-3">
          {mockReports.map(report => (
            <div key={report.id} className="rounded-[18px] ring-1 ring-[rgba(11,15,18,0.08)] p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full ring-1 ring-[rgba(11,15,18,0.15)] flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#0B0F12]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B0F12]">{report.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-[rgba(11,15,18,0.5)]">{report.generatedDate}</span>
                    <span className="text-[11px] text-[rgba(11,15,18,0.3)]">•</span>
                    <span className="text-[11px] text-[rgba(11,15,18,0.5)]">{report.size}</span>
                    <span className="text-[11px] text-[rgba(11,15,18,0.3)]">•</span>
                    <span className="text-[11px] text-[rgba(11,15,18,0.5)]">{report.format}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="p-2 rounded-full"><Eye className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" className="p-2 rounded-full"><Download className="w-4 h-4" /></Button>
                <div className="bg-[#bdeed3] px-3 py-1 rounded-full">
                  <span className="text-[10px] font-medium text-[#0B0F12]">جاهز</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AppCardSurface>

      {/* Auto Reports Settings */}
      <div className="rounded-[24px] bg-[#FFFFFF] ring-1 ring-[#DADCE0] p-6">
        <h3 className="text-[11px] font-medium text-[rgba(11,15,18,0.6)] uppercase tracking-wide mb-5">الإعدادات والتقارير الآلية</h3>
        <AppDashboardGrid columns={12} density="default" minRowHeight="auto">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#0B0F12] mb-3">التقارير الدورية</h4>
            {[
              { name: 'تقرير التقدم الأسبوعي', color: '#bdeed3', status: 'مفعل' },
              { name: 'التقرير المالي الشهري', color: '#a4e2f6', status: 'مفعل' },
              { name: 'تقييم الفريق الشهري', color: '#f1b5b9', status: 'معطل' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-[14px] ring-1 ring-[rgba(11,15,18,0.08)]">
                <span className="text-sm text-[#0B0F12]">{item.name}</span>
                <div className="px-2.5 py-1 rounded-full" style={{ backgroundColor: item.color }}>
                  <span className="text-[10px] font-medium text-[#0B0F12]">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#0B0F12] mb-3">التصدير السريع</h4>
            {['تصدير تقرير التقدم الحالي', 'تصدير البيانات المالية', 'تصدير تقرير الفريق'].map((label, i) => (
              <Button key={i} className="w-full rounded-full text-sm font-medium ring-1 ring-[rgba(11,15,18,0.1)] bg-transparent text-[#0B0F12] hover:bg-[rgba(11,15,18,0.05)]">
                {label}
              </Button>
            ))}
            <Button className="w-full bg-[#0B0F12] text-white rounded-full text-sm font-medium hover:bg-[rgba(11,15,18,0.85)]">
              تصدير تقرير شامل
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
