
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, BarChart, Eye, Download } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';

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
        <h3 className="text-large font-semibold text-black font-arabic">التقارير المالية</h3>
        <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
          <FileText className="w-4 h-4" />
          إنشاء تقرير مخصص
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <div key={index} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
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
                <button className="bg-transparent border border-black text-black px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  عرض
                </button>
                <button className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  تصدير
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
