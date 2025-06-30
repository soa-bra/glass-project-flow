
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, TrendingUp } from 'lucide-react';

export const ComplianceTab: React.FC = () => {
  const complianceItems = [
    { id: 1, title: 'قانون حماية البيانات الشخصية', status: 'مُمتثل', lastReview: '2024-05-15', nextReview: '2024-08-15', risk: 'منخفض' },
    { id: 2, title: 'لوائح وزارة التجارة', status: 'قيد المراجعة', lastReview: '2024-04-20', nextReview: '2024-07-20', risk: 'متوسط' },
    { id: 3, title: 'قانون العمل السعودي', status: 'مُمتثل', lastReview: '2024-06-01', nextReview: '2024-09-01', risk: 'منخفض' },
    { id: 4, title: 'لوائح مكافحة غسل الأموال', status: 'يتطلب إجراء', lastReview: '2024-03-10', nextReview: '2024-06-10', risk: 'عالي' }
  ];

  const policies = [
    { id: 1, name: 'سياسة حماية البيانات', version: '2.1', lastUpdate: '2024-05-20', status: 'محدثة' },
    { id: 2, name: 'سياسة مكافحة الفساد', version: '1.8', lastUpdate: '2024-04-15', status: 'تحتاج تحديث' },
    { id: 3, name: 'سياسة الموارد البشرية', version: '3.0', lastUpdate: '2024-06-10', status: 'محدثة' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Compliance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BaseCard size="md" className="text-center">
          <div className="space-y-2">
            <CheckCircle className="w-8 h-8 mx-auto text-green-600" />
            <div className="text-2xl font-bold text-gray-800">95%</div>
            <div className="text-sm text-gray-600">نسبة الامتثال</div>
          </div>
        </BaseCard>

        <BaseCard size="md" className="text-center">
          <div className="space-y-2">
            <AlertTriangle className="w-8 h-8 mx-auto text-red-600" />
            <div className="text-2xl font-bold text-gray-800">3</div>
            <div className="text-sm text-gray-600">مخاطر عالية</div>
          </div>
        </BaseCard>

        <BaseCard size="md" className="text-center">
          <div className="space-y-2">
            <Clock className="w-8 h-8 mx-auto text-yellow-600" />
            <div className="text-2xl font-bold text-gray-800">7</div>
            <div className="text-sm text-gray-600">مراجعات مستحقة</div>
          </div>
        </BaseCard>

        <BaseCard size="md" className="text-center">
          <div className="space-y-2">
            <FileText className="w-8 h-8 mx-auto text-blue-600" />
            <div className="text-2xl font-bold text-gray-800">24</div>
            <div className="text-sm text-gray-600">السياسات النشطة</div>
          </div>
        </BaseCard>
      </div>

      {/* Compliance Matrix */}
      <BaseCard size="lg" header={
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-arabic font-bold text-gray-800">مصفوفة الامتثال</h3>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            تقرير شامل
          </Button>
        </div>
      }>
        <div className="space-y-4">
          {complianceItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>آخر مراجعة: {item.lastReview}</span>
                    <span>المراجعة التالية: {item.nextReview}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'مُمتثل' ? 'bg-green-100 text-green-800' :
                    item.status === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.risk === 'منخفض' ? 'bg-green-100 text-green-800' :
                    item.risk === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.risk}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline">مراجعة</Button>
                <Button size="sm" variant="outline">تحديث</Button>
                <Button size="sm" variant="outline">تقرير</Button>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* Policies Management */}
      <BaseCard size="lg" header={
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-arabic font-bold text-gray-800">إدارة السياسات</h3>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            سياسة جديدة
          </Button>
        </div>
      }>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policies.map((policy) => (
            <div key={policy.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <Shield className="w-6 h-6 text-blue-600 mt-1" />
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  policy.status === 'محدثة' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {policy.status}
                </div>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{policy.name}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>الإصدار: {policy.version}</div>
                <div>آخر تحديث: {policy.lastUpdate}</div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline">عرض</Button>
                <Button size="sm" variant="outline">تعديل</Button>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* AI Compliance Insights */}
      <BaseCard size="lg" header={
        <h3 className="text-lg font-arabic font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          رؤى الذكاء الاصطناعي للامتثال
        </h3>
      }>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">AI</div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-800 mb-2">توصية: تحديث سياسة حماية البيانات</h4>
                <p className="text-blue-700 text-sm">
                  تم اكتشاف تحديثات جديدة في لوائح حماية البيانات. يُنصح بمراجعة السياسة الحالية وتحديثها خلال الأسبوعين القادمين.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold">AI</div>
              <div className="flex-1">
                <h4 className="font-bold text-yellow-800 mb-2">تنبيه: مراجعة مستحقة</h4>
                <p className="text-yellow-700 text-sm">
                  هناك 3 سياسات تتطلب مراجعة دورية خلال الشهر الحالي. يُنصح بجدولة جلسات المراجعة مع الفرق المختصة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  );
};
