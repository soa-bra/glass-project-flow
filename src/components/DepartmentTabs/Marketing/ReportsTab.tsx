
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp, PieChart, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const ReportsTab: React.FC = () => {
  const reportTypes = [
    {
      title: 'تقرير أداء الحملات',
      description: 'تحليل شامل لأداء جميع الحملات التسويقية',
      icon: BarChart3,
      status: 'متاح',
      lastGenerated: 'منذ يوم واحد',
      frequency: 'أسبوعي'
    },
    {
      title: 'تقرير عائد الاستثمار (ROI)',
      description: 'تحليل مفصل لعائد الاستثمار على الأنشطة التسويقية',
      icon: TrendingUp,
      status: 'قيد الإعداد',
      lastGenerated: 'منذ 3 أيام',
      frequency: 'شهري'
    },
    {
      title: 'تقرير الجمهور والتفاعل',
      description: 'إحصائيات الجمهور المستهدف ومعدلات التفاعل',
      icon: Target,
      status: 'متاح',
      lastGenerated: 'منذ ساعتين',
      frequency: 'يومي'
    },
    {
      title: 'تقرير توزيع الميزانية',
      description: 'تحليل إنفاق الميزانية عبر القنوات المختلفة',
      icon: PieChart,
      status: 'جديد',
      lastGenerated: '-',
      frequency: 'ربع سنوي'
    }
  ];

  const recentReports = [
    {
      name: 'تقرير الحملات الرقمية - يناير 2024',
      date: '2024-01-15',
      size: '3.2 MB',
      type: 'PDF',
      category: 'أداء الحملات',
      downloads: 12
    },
    {
      name: 'تحليل عائد الاستثمار - الربع الأخير 2023',
      date: '2024-01-10',
      size: '2.1 MB',
      type: 'Excel',
      category: 'عائد الاستثمار',
      downloads: 8
    },
    {
      name: 'تقرير وسائل التواصل الاجتماعي',
      date: '2024-01-08',
      size: '1.8 MB',
      type: 'PowerPoint',
      category: 'التفاعل',
      downloads: 15
    },
    {
      name: 'ملخص الميزانية الشهرية',
      date: '2024-01-05',
      size: '1.2 MB',
      type: 'PDF',
      category: 'ميزانية',
      downloads: 6
    }
  ];

  const scheduledReports = [
    {
      name: 'تقرير الأداء الأسبوعي',
      nextGeneration: '2024-01-22',
      frequency: 'كل يوم اثنين',
      recipients: 5,
      automated: true
    },
    {
      name: 'تحليل الحملات الشهري',
      nextGeneration: '2024-02-01',
      frequency: 'أول كل شهر',
      recipients: 8,
      automated: true
    },
    {
      name: 'تقرير عائد الاستثمار الربع سنوي',
      nextGeneration: '2024-04-01',
      frequency: 'كل ربع سنة',
      recipients: 3,
      automated: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'متاح':
        return <Badge variant="default" className="text-xs">متاح</Badge>;
      case 'قيد الإعداد':
        return <Badge variant="secondary" className="text-xs">قيد الإعداد</Badge>;
      case 'جديد':
        return <Badge variant="outline" className="text-xs">جديد</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">غير معروف</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* أنواع التقارير */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">أنواع التقارير التسويقية</h3>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 ml-1" />
            فلترة
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <report.icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium font-arabic text-sm">{report.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 font-arabic">{report.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs font-arabic">
                        {report.frequency}
                      </Badge>
                    </div>
                  </div>
                </div>
                {getStatusBadge(report.status)}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-arabic">آخر إنشاء: {report.lastGenerated}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <span className="font-arabic">{report.downloads} تحميل</span>
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

        {/* التقارير المجدولة */}
        <BaseCard variant="operations" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800 font-arabic">التقارير المجدولة</h3>
            </div>
            <Button variant="outline" size="sm">
              إضافة جدولة
            </Button>
          </div>
          
          <div className="space-y-3">
            {scheduledReports.map((report, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium font-arabic text-sm">{report.name}</h4>
                  <Badge 
                    variant={report.automated ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {report.automated ? 'تلقائي' : 'يدوي'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="font-arabic">الإنشاء التالي: </span>
                    <span>{report.nextGeneration}</span>
                  </div>
                  <div>
                    <span className="font-arabic">التكرار: </span>
                    <span className="font-arabic">{report.frequency}</span>
                  </div>
                  <div>
                    <span className="font-arabic">المستلمون: </span>
                    <span>{report.recipients}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-blue-600 mb-1 font-arabic">28</h3>
          <p className="text-sm text-gray-600 font-arabic">تقرير هذا الشهر</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-green-600 mb-1 font-arabic">184</h3>
          <p className="text-sm text-gray-600 font-arabic">إجمالي التقارير</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-purple-600 mb-1 font-arabic">12</h3>
          <p className="text-sm text-gray-600 font-arabic">تقرير مجدول</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-orange-600 mb-1 font-arabic">156</h3>
          <p className="text-sm text-gray-600 font-arabic">إجمالي التحميلات</p>
        </BaseCard>
      </div>
    </div>
  );
};
