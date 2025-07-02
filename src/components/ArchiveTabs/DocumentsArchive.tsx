
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { FileText, Download, Eye, Calendar } from 'lucide-react';

export const DocumentsArchive: React.FC = () => {
  const kpiStats = [
    {
      title: 'إجمالي الوثائق',
      value: 1245,
      unit: 'وثيقة',
      description: 'الوثائق المؤرشفة'
    },
    {
      title: 'حجم البيانات',
      value: '2.3',
      unit: 'جيجابايت',
      description: 'المساحة المستخدمة'
    },
    {
      title: 'آخر إضافة',
      value: 3,
      unit: 'أيام',
      description: 'منذ آخر وثيقة'
    },
    {
      title: 'معدل الوصول',
      value: 156,
      unit: 'مشاهدة/شهر',
      description: 'متوسط المشاهدات'
    }
  ];

  const recentDocuments = [
    { name: 'تقرير الأداء السنوي 2023', date: '2024-01-15', size: '2.4 MB', downloads: 45 },
    { name: 'دليل السياسات المحدث', date: '2023-12-20', size: '1.8 MB', downloads: 23 },
    { name: 'خطة التطوير الاستراتيجي', date: '2023-11-10', size: '3.1 MB', downloads: 67 },
    { name: 'مراجعة العمليات Q4', date: '2023-10-25', size: '1.2 MB', downloads: 34 }
  ];

  return (
    <div className="space-y-6">
      {/* مؤشرات الأداء الأساسية */}
      <KPIStatsSection stats={kpiStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              الوثائق المضافة حديثاً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{doc.name}</h4>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {doc.date}
                      </span>
                      <span>{doc.size}</span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {doc.downloads}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Categories */}
        <Card>
          <CardHeader>
            <CardTitle>فئات الوثائق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded bg-gray-50">
                <span>التقارير الإدارية</span>
                <Badge variant="secondary">245 وثيقة</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-gray-50">
                <span>السياسات والإجراءات</span>
                <Badge variant="secondary">89 وثيقة</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-gray-50">
                <span>الخطط الاستراتيجية</span>
                <Badge variant="secondary">34 وثيقة</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-gray-50">
                <span>المراسلات الرسمية</span>
                <Badge variant="secondary">567 وثيقة</Badge>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-gray-50">
                <span>العقود والاتفاقيات</span>
                <Badge variant="secondary">123 وثيقة</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
