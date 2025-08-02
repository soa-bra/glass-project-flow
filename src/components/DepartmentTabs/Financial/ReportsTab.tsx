
import React from 'react';
import { FileText, BarChart, Eye, Download } from 'lucide-react';
import { UnifiedSystemCard } from '@/components/ui/UnifiedSystemCard';
import { UnifiedSystemButton } from '@/components/ui/UnifiedSystemButton';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">التقارير المالية</h3>
        <UnifiedSystemButton variant="primary" icon={<FileText />}>
          إنشاء تقرير مخصص
        </UnifiedSystemButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <UnifiedSystemCard key={index} size="md">
            <div className="flex items-center gap-3 mb-4">
              <BarChart className="h-8 w-8 text-black" />
              <div>
                <h4 className="text-sm font-bold text-black font-arabic">{report.name}</h4>
                <p className="text-sm font-normal text-black">{report.period}</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-normal text-gray-400">آخر تحديث: {report.lastGenerated}</p>
              <div className="flex gap-2">
                <UnifiedSystemButton variant="outline" size="sm" icon={<Eye />}>
                  عرض
                </UnifiedSystemButton>
                <UnifiedSystemButton variant="primary" size="sm" icon={<Download />}>
                  تصدير
                </UnifiedSystemButton>
              </div>
            </div>
          </UnifiedSystemCard>
        ))}
      </div>
    </div>
  );
};
