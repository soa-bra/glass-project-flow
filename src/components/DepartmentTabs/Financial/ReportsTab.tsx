import React from 'react';
import { FileText, BarChart, Eye, Download } from 'lucide-react';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { buildTitleClasses, COLORS, TYPOGRAPHY, SPACING } from '@/components/shared/design-system/constants';
import { Reveal, Stagger } from '@/components/shared/motion';
import { cn } from '@/lib/utils';

export const ReportsTab: React.FC = () => {
  const reports = [
    { name: 'تقرير الأرباح والخسائر', period: 'شهري', lastGenerated: '2024-06-29' },
    { name: 'تقرير المركز المالي', period: 'ربع سنوي', lastGenerated: '2024-06-28' },
    { name: 'تقرير التدفق النقدي', period: 'أسبوعي', lastGenerated: '2024-06-30' },
    { name: 'تقرير تحليل المصروفات', period: 'شهري', lastGenerated: '2024-06-29' },
    { name: 'تقرير أداء الميزانية', period: 'شهري', lastGenerated: '2024-06-29' },
    { name: 'تقرير حسابات العملاء', period: 'أسبوعي', lastGenerated: '2024-06-30' }
  ];

  return (
    <BaseTabContent value="reports">
      <Reveal>
        <div className={cn('flex justify-between items-center', SPACING.SECTION_MARGIN)}>
          <h3 className={buildTitleClasses()}>التقارير المالية</h3>
          <BaseActionButton variant="primary" icon={<FileText className="w-4 h-4" />}>
            إنشاء تقرير مخصص
          </BaseActionButton>
        </div>
      </Reveal>

      <Stagger gap={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <Stagger.Item key={index}>
            <BaseCard>
              <div className="flex items-center gap-3 mb-4">
                <BarChart className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className={cn(TYPOGRAPHY.BODY, 'font-semibold', COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                    {report.name}
                  </h4>
                  <p className={cn(TYPOGRAPHY.SMALL, COLORS.SECONDARY_TEXT)}>
                    {report.period}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <p className={cn(TYPOGRAPHY.SMALL, 'text-gray-400')}>
                  آخر تحديث: {report.lastGenerated}
                </p>
                <div className="flex gap-2">
                  <BaseActionButton 
                    variant="outline" 
                    size="sm"
                    icon={<Eye className="w-4 h-4" />}
                  >
                    عرض
                  </BaseActionButton>
                  <BaseActionButton 
                    variant="primary" 
                    size="sm"
                    icon={<Download className="w-4 h-4" />}
                  >
                    تصدير
                  </BaseActionButton>
                </div>
              </div>
            </BaseCard>
          </Stagger.Item>
        ))}
      </Stagger>
    </BaseTabContent>
  );
};