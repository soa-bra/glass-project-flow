
import React from 'react';
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ReportsTabProps {
  departmentTitle: string;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ departmentTitle }) => {
  const reportTypes = [
    {
      title: 'التقرير الشهري',
      description: 'ملخص شامل للأنشطة والإنجازات الشهرية',
      icon: Calendar,
      status: 'متاح',
      lastGenerated: 'منذ 3 أيام'
    },
    {
      title: 'تقرير الأداء',
      description: 'تحليل مفصل لمؤشرات الأداء الرئيسية',
      icon: TrendingUp,
      status: 'قيد الإعداد',
      lastGenerated: 'منذ أسبوع'
    },
    {
      title: 'التقرير المالي',
      description: 'بيانات الميزانية والمصروفات والإيرادات',
      icon: BarChart3,
      status: 'متاح',
      lastGenerated: 'منذ يوم واحد'
    },
    {
      title: 'تقرير مخصص',
      description: 'إنشاء تقرير حسب المعايير المحددة',
      icon: Filter,
      status: 'جديد',
      lastGenerated: '-'
    }
  ];

  const recentReports = [
    {
      name: 'تقرير الأداء - ديسمبر 2024',
      date: '2024-12-25',
      size: '2.4 MB',
      type: 'PDF'
    },
    {
      name: 'التقرير المالي - الربع الرابع',
      date: '2024-12-20',
      size: '1.8 MB',
      type: 'Excel'
    },
    {
      name: 'تقرير المشاريع النشطة',
      date: '2024-12-18',
      size: '3.2 MB',
      type: 'PDF'
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* أنواع التقارير */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">أنواع التقارير المتاحة</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <report.icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium font-arabic text-sm">{report.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{report.description}</p>
                  </div>
                </div>
                <Badge 
                  variant={
                    report.status === 'متاح' ? 'default' :
                    report.status === 'قيد الإعداد' ? 'secondary' : 'outline'
                  }
                  className="text-xs"
                >
                  {report.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">آخر إنشاء: {report.lastGenerated}</span>
                <Button 
                  size="sm" 
                  variant={report.status === 'متاح' ? 'default' : 'outline'}
                  className="text-xs"
                  disabled={report.status !== 'متاح'}
                >
                  {report.status === 'متاح' ? 'تحميل' : 'إنشاء'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* التقارير الحديثة */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">التقارير الحديثة</h3>
          </div>
          <Button variant="outline" size="sm">
            عرض الكل
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentReports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-600" />
                <div>
                  <h4 className="font-medium font-arabic text-sm">{report.name}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>{report.date}</span>
                    <span>{report.size}</span>
                    <Badge variant="outline" className="text-xs">{report.type}</Badge>
                  </div>
                </div>
              </div>
              
              <Button size="sm" variant="ghost">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-blue-600 mb-1 font-arabic">24</h3>
          <p className="text-sm text-gray-600 font-arabic">تقرير هذا الشهر</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-green-600 mb-1 font-arabic">156</h3>
          <p className="text-sm text-gray-600 font-arabic">إجمالي التقارير</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-purple-600 mb-1 font-arabic">8.2 GB</h3>
          <p className="text-sm text-gray-600 font-arabic">حجم البيانات</p>
        </BaseCard>
      </div>
    </div>
  );
};
