
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, BarChart, Eye, Download } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

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
        <h3 className="text-lg font-semibold text-black font-arabic">التقارير المالية</h3>
        <Button className="bg-transparent border border-black/20 text-black hover:bg-black/5 rounded-full">
          <FileText className="w-4 h-4 mr-2" />
          إنشاء تقرير مخصص
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <div key={index} className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BarChart className="h-8 w-8 text-black" />
                <div>
                  <h4 className="text-sm font-bold text-black font-arabic">{report.name}</h4>
                  <p className="text-sm font-medium text-black font-arabic">{report.period}</p>
                </div>
              </div>
              <CircularIconButton 
                icon={Download}
                size="sm"
                className="w-8 h-8 bg-transparent border border-black/20 text-black"
              />
            </div>
            <div className="space-y-3">
              <p className="text-xs font-normal text-gray-400 font-arabic">آخر تحديث: {report.lastGenerated}</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-transparent border border-black/20 text-black hover:bg-black/5 rounded-full flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  عرض
                </Button>
                <Button 
                  size="sm"
                  className="bg-transparent border border-black/20 text-black hover:bg-black/5 rounded-full flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
