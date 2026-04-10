
import React from 'react';
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp } from 'lucide-react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { NumericStatCard } from '@/components/shared/visual-data/NumericStatCard';

interface ReportsTabProps {
  departmentTitle: string;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ departmentTitle }) => {
  const reportTypes = [
    { title: 'التقرير الشهري', description: 'ملخص شامل للأنشطة والإنجازات الشهرية', icon: Calendar, status: 'متاح', lastGenerated: 'منذ 3 أيام' },
    { title: 'تقرير الأداء', description: 'تحليل مفصل لمؤشرات الأداء الرئيسية', icon: TrendingUp, status: 'قيد الإعداد', lastGenerated: 'منذ أسبوع' },
    { title: 'التقرير المالي', description: 'بيانات الميزانية والمصروفات والإيرادات', icon: BarChart3, status: 'متاح', lastGenerated: 'منذ يوم واحد' },
    { title: 'تقرير مخصص', description: 'إنشاء تقرير حسب المعايير المحددة', icon: Filter, status: 'جديد', lastGenerated: '-' },
  ];

  const recentReports = [
    { name: 'تقرير الأداء - ديسمبر 2024', date: '2024-12-25', size: '2.4 MB', type: 'PDF' },
    { name: 'التقرير المالي - الربع الرابع', date: '2024-12-20', size: '1.8 MB', type: 'Excel' },
    { name: 'تقرير المشاريع النشطة', date: '2024-12-18', size: '3.2 MB', type: 'PDF' },
  ];

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* أنواع التقارير */}
      <BaseBox variant="unified" className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6 text-[#0B0F12]" />
          <h3 className="text-xl font-bold text-[#0B0F12] font-arabic">أنواع التقارير المتاحة</h3>
        </div>

        <AppDashboardGrid columns={12} density="default">
          {reportTypes.map((report, index) => (
            <AppGridItem key={index} colSpan={6} tabletSpan={3}>
              <div className="p-4 bg-white rounded-[18px] border border-[#DADCE0] h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <report.icon className="h-5 w-5 text-[#0B0F12]" />
                    <div>
                      <h4 className="font-medium font-arabic text-sm">{report.title}</h4>
                      <p className="text-xs text-[rgba(11,15,18,0.5)] mt-1">{report.description}</p>
                    </div>
                  </div>
                  <BaseBadge
                    variant={report.status === 'متاح' ? 'default' : report.status === 'قيد الإعداد' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {report.status}
                  </BaseBadge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[rgba(11,15,18,0.4)]">آخر إنشاء: {report.lastGenerated}</span>
                  <BaseActionButton
                    size="sm"
                    variant={report.status === 'متاح' ? 'primary' : 'outline'}
                    className="text-xs"
                    disabled={report.status !== 'متاح'}
                  >
                    {report.status === 'متاح' ? 'تحميل' : 'إنشاء'}
                  </BaseActionButton>
                </div>
              </div>
            </AppGridItem>
          ))}
        </AppDashboardGrid>
      </BaseBox>

      {/* التقارير الحديثة */}
      <BaseBox variant="unified" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-[#0B0F12]" />
            <h3 className="text-xl font-bold text-[#0B0F12] font-arabic">التقارير الحديثة</h3>
          </div>
          <BaseActionButton variant="outline" size="sm">عرض الكل</BaseActionButton>
        </div>
        <div className="space-y-3">
          {recentReports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-[18px] border border-[#DADCE0]">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-[rgba(11,15,18,0.5)]" />
                <div>
                  <h4 className="font-medium font-arabic text-sm">{report.name}</h4>
                  <div className="flex items-center gap-4 text-xs text-[rgba(11,15,18,0.4)] mt-1">
                    <span>{report.date}</span>
                    <span>{report.size}</span>
                    <BaseBadge variant="outline" className="text-xs">{report.type}</BaseBadge>
                  </div>
                </div>
              </div>
              <BaseActionButton size="sm" variant="ghost">
                <Download className="h-4 w-4" />
              </BaseActionButton>
            </div>
          ))}
        </div>
      </BaseBox>

      {/* إحصائيات سريعة */}
      <AppDashboardGrid columns={12} density="default">
        <AppGridItem colSpan={4} tabletSpan={2}>
          <NumericStatCard title="هذا الشهر" value="24" unit="تقرير" size="sm" />
        </AppGridItem>
        <AppGridItem colSpan={4} tabletSpan={2}>
          <NumericStatCard title="إجمالي التقارير" value="156" unit="تقرير" size="sm" />
        </AppGridItem>
        <AppGridItem colSpan={4} tabletSpan={2}>
          <NumericStatCard title="حجم البيانات" value="8.2" unit="GB" size="sm" />
        </AppGridItem>
      </AppDashboardGrid>
    </div>
  );
};
