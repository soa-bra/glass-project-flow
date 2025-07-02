
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';

interface GeneralArchiveTabProps {
  categoryTitle: string;
  categoryType: string;
}

export const GeneralArchiveTab: React.FC<GeneralArchiveTabProps> = ({ 
  categoryTitle, 
  categoryType 
}) => {
  const kpiStats = [
    {
      title: 'إجمالي العناصر',
      value: 456,
      unit: 'عنصر',
      description: 'العناصر المؤرشفة'
    },
    {
      title: 'حجم البيانات',
      value: '8.7',
      unit: 'جيجابايت',
      description: 'المساحة المستخدمة'
    },
    {
      title: 'آخر إضافة',
      value: 12,
      unit: 'يوم',
      description: 'منذ آخر عنصر'
    },
    {
      title: 'معدل الوصول',
      value: 45,
      unit: 'مشاهدة/شهر',
      description: 'متوسط الاستخدام'
    }
  ];

  return (
    <div className="space-y-6">
      <KPIStatsSection stats={kpiStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات عامة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">الفئة: {categoryTitle}</h4>
                <p className="text-sm text-gray-600">
                  هذا القسم يحتوي على جميع العناصر المؤرشفة المتعلقة بـ{categoryTitle}.
                  يمكنك البحث والفلترة والوصول إلى الإحصائيات التفصيلية من خلال التبويبات أعلاه.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الوصول السريع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-3 text-right border rounded-lg hover:bg-gray-50">
                عرض أحدث العناصر
              </button>
              <button className="w-full p-3 text-right border rounded-lg hover:bg-gray-50">
                البحث في الأرشيف
              </button>
              <button className="w-full p-3 text-right border rounded-lg hover:bg-gray-50">
                تصدير البيانات
              </button>
              <button className="w-full p-3 text-right border rounded-lg hover:bg-gray-50">
                إعداد التصنيفات
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
