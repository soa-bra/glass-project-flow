import React from 'react';
import { FileText, Eye, Download } from 'lucide-react';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { SPACING } from '@/components/shared/design-system/constants';
import { Reveal, Stagger } from '@/components/shared/motion';
import { cn } from '@/lib/utils';
import { downloadAsCSV } from '../shared/downloadUtils';
import { toast } from 'sonner';

export const ReportsTab: React.FC = () => {
  const reports = [
    { name: 'تقرير الأرباح والخسائر', period: 'شهري', lastGenerated: '2024-06-29' },
    { name: 'تقرير المركز المالي', period: 'ربع سنوي', lastGenerated: '2024-06-28' },
    { name: 'تقرير التدفق النقدي', period: 'أسبوعي', lastGenerated: '2024-06-30' },
    { name: 'تقرير تحليل المصروفات', period: 'شهري', lastGenerated: '2024-06-29' },
    { name: 'تقرير أداء الميزانية', period: 'شهري', lastGenerated: '2024-06-29' },
    { name: 'تقرير حسابات العملاء', period: 'أسبوعي', lastGenerated: '2024-06-30' },
  ];

  const handleViewReport = (report: typeof reports[0]) => {
    toast.info(`عرض: ${report.name} - الفترة: ${report.period} - آخر تحديث: ${report.lastGenerated}`);
  };

  const handleExportReport = (report: typeof reports[0]) => {
    downloadAsCSV(
      ['اسم التقرير', 'الفترة', 'آخر إنشاء'],
      [[report.name, report.period, report.lastGenerated]],
      `تقرير-مالي-${report.name}`
    );
    toast.success(`تم تصدير: ${report.name}`);
  };

  const handleCreateReport = () => {
    const allData = reports.map(r => [r.name, r.period, r.lastGenerated]);
    downloadAsCSV(
      ['اسم التقرير', 'الفترة', 'آخر إنشاء'],
      allData,
      `تقرير-مالي-مخصص-${new Date().toISOString().split('T')[0]}`
    );
    toast.success('تم إنشاء وتحميل التقرير المخصص بنجاح');
  };

  return (
    <BaseTabContent value="reports">
      <Reveal>
        <div className={cn('flex justify-between items-center', SPACING.SECTION_MARGIN)}>
          <h3 className="text-lg font-bold text-[#0B0F12] font-arabic">التقارير المالية</h3>
          <BaseActionButton variant="primary" icon={<FileText className="w-4 h-4" />} onClick={handleCreateReport}>
            إنشاء تقرير مخصص
          </BaseActionButton>
        </div>
      </Reveal>

      <Stagger gap={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((report, index) => (
          <Stagger.Item key={index}>
            <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col justify-between min-h-[180px]">
              <div>
                <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic">{report.period}</span>
                <h4 className="text-base font-bold text-[#0B0F12] font-arabic mt-2 leading-snug">
                  {report.name}
                </h4>
              </div>
              <div className="mt-auto pt-4">
                <p className="text-[11px] text-[rgba(11,15,18,0.35)] font-arabic mb-3">
                  آخر تحديث: {report.lastGenerated}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewReport(report)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DADCE0] text-xs font-medium text-[#0B0F12] hover:bg-[#d9e7ed]/50 transition-colors font-arabic"
                  >
                    <Eye className="w-3.5 h-3.5" /> عرض
                  </button>
                  <button
                    onClick={() => handleExportReport(report)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B0F12] text-white text-xs font-medium hover:bg-[#0B0F12]/90 transition-colors font-arabic"
                  >
                    <Download className="w-3.5 h-3.5" /> تصدير
                  </button>
                </div>
              </div>
            </div>
          </Stagger.Item>
        ))}
      </Stagger>
    </BaseTabContent>
  );
};
