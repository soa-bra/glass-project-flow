import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, BarChart, Eye, Download } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
export const ReportsTab: React.FC = () => {
  const reports = [{
    name: 'تقرير الأرباح والخسائر',
    period: 'شهري',
    lastGenerated: '2024-06-29'
  }, {
    name: 'تقرير المركز المالي',
    period: 'ربع سنوي',
    lastGenerated: '2024-06-28'
  }, {
    name: 'تقرير التدفق النقدي',
    period: 'أسبوعي',
    lastGenerated: '2024-06-30'
  }, {
    name: 'تقرير تحليل المصروفات',
    period: 'شهري',
    lastGenerated: '2024-06-29'
  }, {
    name: 'تقرير أداء الميزانية',
    period: 'شهري',
    lastGenerated: '2024-06-29'
  }, {
    name: 'تقرير حسابات العملاء',
    period: 'أسبوعي',
    lastGenerated: '2024-06-30'
  }];
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">التقارير المالية</h3>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          إنشاء تقرير مخصص
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => <BaseCard key={index} variant="operations" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart className="h-8 w-8 text-green-600" />
              
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">آخر تحديث: {report.lastGenerated}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  عرض
                </Button>
                <Button size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  تصدير
                </Button>
              </div>
            </div>
          </BaseCard>)}
      </div>
    </div>;
};