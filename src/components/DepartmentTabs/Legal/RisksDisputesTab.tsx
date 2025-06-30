
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertTriangle, Scale, FileText, TrendingUp, Clock, Users, DollarSign } from 'lucide-react';

export const RisksDisputesTab: React.FC = () => {
  const risks = [
    { id: 1, title: 'تأخير في تسليم المشروع X', level: 'عالي', probability: '85%', impact: 'مالي', estimated_cost: '200,000 ر.س', status: 'نشط' },
    { id: 2, title: 'خلاف تعاقدي مع المورد ABC', level: 'متوسط', probability: '60%', impact: 'تشغيلي', estimated_cost: '50,000 ر.س', status: 'قيد المتابعة' },
    { id: 3, title: 'مخاطر امتثال في المشروع الجديد', level: 'منخفض', probability: '25%', impact: 'سمعة', estimated_cost: '10,000 ر.س', status: 'مُراقب' }
  ];

  const disputes = [
    { id: 1, title: 'نزاع تجاري - شركة XYZ', type: 'تجاري', status: 'جاري', court: 'المحكمة التجارية - الرياض', lawyer: 'المحامي أحمد محمد', nextHearing: '2024-07-15', value: '500,000 ر.س' },
    { id: 2, title: 'دعوى تعويض - موظف سابق', type: 'عمالي', status: 'تحت الدراسة', court: 'لجنة تسوية المنازعات العمالية', lawyer: 'المحامية فاطمة علي', nextHearing: '2024-07-20', value: '75,000 ر.س' },
    { id: 3, title: 'نزاع ملكية فكرية', type: 'ملكية فكرية', status: 'محلول', court: 'المحكمة العامة', lawyer: 'المحامي سعد الأحمد', nextHearing: '', value: '120,000 ر.س' }
  ];

  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="risks" dir="rtl">
        <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm rounded-full">
          <TabsTrigger value="risks" className="rounded-full">إدارة المخاطر</TabsTrigger>
          <TabsTrigger value="disputes" className="rounded-full">النزاعات والقضايا</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-full">تحليل المخاطر</TabsTrigger>
        </TabsList>

        <TabsContent value="risks" className="space-y-6">
          {/* Risk Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <AlertTriangle className="w-8 h-8 mx-auto text-red-600" />
                <div className="text-2xl font-bold text-gray-800">12</div>
                <div className="text-sm text-gray-600">المخاطر النشطة</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <TrendingUp className="w-8 h-8 mx-auto text-yellow-600" />
                <div className="text-2xl font-bold text-gray-800">3</div>
                <div className="text-sm text-gray-600">مخاطر عالية</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <DollarSign className="w-8 h-8 mx-auto text-green-600" />
                <div className="text-2xl font-bold text-gray-800">1.2M</div>
                <div className="text-sm text-gray-600">التكلفة المقدرة (ر.س)</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <Clock className="w-8 h-8 mx-auto text-blue-600" />
                <div className="text-2xl font-bold text-gray-800">7</div>
                <div className="text-sm text-gray-600">تتطلب إجراء</div>
              </div>
            </BaseCard>
          </div>

          {/* Risk Register */}
          <BaseCard size="lg" header={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-arabic font-bold text-gray-800">سجل المخاطر</h3>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                تسجيل مخاطرة جديدة
              </Button>
            </div>
          }>
            <div className="space-y-4">
              {risks.map((risk) => (
                <div key={risk.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2">{risk.title}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">الاحتمالية: </span>
                          <span className="font-medium">{risk.probability}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">نوع التأثير: </span>
                          <span className="font-medium">{risk.impact}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">التكلفة المقدرة: </span>
                          <span className="font-medium">{risk.estimated_cost}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">الحالة: </span>
                          <span className="font-medium">{risk.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      risk.level === 'عالي' ? 'bg-red-100 text-red-800' :
                      risk.level === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.level}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">خطة التخفيف</Button>
                    <Button size="sm" variant="outline">تحديث الحالة</Button>
                    <Button size="sm" variant="outline">تقرير مفصل</Button>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="disputes" className="space-y-6">
          {/* Disputes Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <Scale className="w-8 h-8 mx-auto text-purple-600" />
                <div className="text-2xl font-bold text-gray-800">8</div>
                <div className="text-sm text-gray-600">القضايا النشطة</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <Users className="w-8 h-8 mx-auto text-blue-600" />
                <div className="text-2xl font-bold text-gray-800">5</div>
                <div className="text-sm text-gray-600">المحامون المعينون</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <DollarSign className="w-8 h-8 mx-auto text-green-600" />
                <div className="text-2xl font-bold text-gray-800">2.1M</div>
                <div className="text-sm text-gray-600">قيمة القضايا (ر.س)</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <Clock className="w-8 h-8 mx-auto text-orange-600" />
                <div className="text-2xl font-bold text-gray-800">3</div>
                <div className="text-sm text-gray-600">جلسات قادمة</div>
              </div>
            </BaseCard>
          </div>

          {/* Active Disputes */}
          <BaseCard size="lg" header={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-arabic font-bold text-gray-800">النزاعات والقضايا النشطة</h3>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                قضية جديدة
              </Button>
            </div>
          }>
            <div className="space-y-4">
              {disputes.map((dispute) => (
                <div key={dispute.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2">{dispute.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">المحكمة: </span>
                          <span className="font-medium">{dispute.court}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">المحامي المعين: </span>
                          <span className="font-medium">{dispute.lawyer}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">قيمة القضية: </span>
                          <span className="font-medium">{dispute.value}</span>
                        </div>
                        {dispute.nextHearing && (
                          <div>
                            <span className="text-gray-500">الجلسة القادمة: </span>
                            <span className="font-medium">{dispute.nextHearing}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        dispute.status === 'جاري' ? 'bg-blue-100 text-blue-800' :
                        dispute.status === 'تحت الدراسة' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {dispute.status}
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {dispute.type}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">تفاصيل القضية</Button>
                    <Button size="sm" variant="outline">الوثائق</Button>
                    <Button size="sm" variant="outline">تحديث الحالة</Button>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BaseCard size="lg" header={
              <h3 className="text-lg font-arabic font-bold text-gray-800">توزيع المخاطر حسب الفئة</h3>
            }>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">مخاطر مالية</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <span className="text-sm font-medium">70%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">مخاطر تشغيلية</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">مخاطر سمعة</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
              </div>
            </BaseCard>

            <BaseCard size="lg" header={
              <h3 className="text-lg font-arabic font-bold text-gray-800">تطور القضايا (آخر 6 أشهر)</h3>
            }>
              <div className="space-y-4">
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">سيتم عرض رسم بياني يوضح تطور عدد القضايا خلال آخر 6 أشهر</p>
                </div>
              </div>
            </BaseCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
