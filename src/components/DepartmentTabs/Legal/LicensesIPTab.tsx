
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield, Copyright, Award, FileText, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const LicensesIPTab: React.FC = () => {
  const licenses = [
    { id: 1, name: 'ترخيص النشاط التجاري', type: 'تجاري', issuer: 'وزارة التجارة', issueDate: '2023-01-15', expiryDate: '2025-01-15', status: 'نشط', renewalDue: 180 },
    { id: 2, name: 'ترخيص البرمجيات', type: 'تقني', issuer: 'هيئة الاتصالات وتقنية المعلومات', issueDate: '2023-06-20', expiryDate: '2024-06-20', status: 'يتطلب تجديد', renewalDue: -30 },
    { id: 3, name: 'شهادة الجودة ISO 9001', type: 'جودة', issuer: 'منظمة الجودة الدولية', issueDate: '2023-08-10', expiryDate: '2026-08-10', status: 'نشط', renewalDue: 730 }
  ];

  const intellectualProperty = [
    { id: 1, name: 'علامة سوبرا التجارية', type: 'علامة تجارية', registrationNumber: 'TM-2023-001', registrationDate: '2023-03-15', expiryDate: '2033-03-15', status: 'مُسجل', region: 'المملكة العربية السعودية' },
    { id: 2, name: 'براءة اختراع - نظام إدارة العمليات', type: 'براءة اختراع', registrationNumber: 'PT-2023-005', registrationDate: '2023-05-20', expiryDate: '2043-05-20', status: 'قيد المراجعة', region: 'دول مجلس التعاون' },
    { id: 3, name: 'حقوق الطبع والنشر - دليل العمليات', type: 'حقوق نشر', registrationNumber: 'CP-2023-012', registrationDate: '2023-07-10', expiryDate: '2073-07-10', status: 'مُسجل', region: 'عالمي' }
  ];

  const applications = [
    { id: 1, title: 'طلب تجديد الترخيص التجاري', type: 'تجديد', status: 'قيد المعالجة', submissionDate: '2024-05-15', expectedCompletion: '2024-07-15' },
    { id: 2, title: 'طلب تسجيل علامة تجارية جديدة', type: 'جديد', status: 'تحت المراجعة', submissionDate: '2024-04-20', expectedCompletion: '2024-10-20' },
    { id: 3, title: 'طلب براءة اختراع - الخوارزمية الذكية', type: 'جديد', status: 'مُقدم', submissionDate: '2024-06-01', expectedCompletion: '2025-06-01' }
  ];

  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="licenses" dir="rtl">
        <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm rounded-full">
          <TabsTrigger value="licenses" className="rounded-full">التراخيص والشهادات</TabsTrigger>
          <TabsTrigger value="ip" className="rounded-full">الملكية الفكرية</TabsTrigger>
          <TabsTrigger value="applications" className="rounded-full">الطلبات الجارية</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="space-y-6">
          {/* Licenses Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <Shield className="w-8 h-8 mx-auto text-green-600" />
                <div className="text-2xl font-bold text-gray-800">42</div>
                <div className="text-sm text-gray-600">التراخيص النشطة</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-red-600" />
                <div className="text-2xl font-bold text-gray-800">3</div>
                <div className="text-sm text-gray-600">تتطلب تجديد</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <Clock className="w-8 h-8 mx-auto text-yellow-600" />
                <div className="text-2xl font-bold text-gray-800">7</div>
                <div className="text-sm text-gray-600">تنتهي خلال 6 أشهر</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <Award className="w-8 h-8 mx-auto text-blue-600" />
                <div className="text-2xl font-bold text-gray-800">8</div>
                <div className="text-sm text-gray-600">شهادات الجودة</div>
              </div>
            </BaseCard>
          </div>

          {/* Licenses List */}
          <BaseCard size="lg" header={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-arabic font-bold text-gray-800">سجل التراخيص والشهادات</h3>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                طلب ترخيص جديد
              </Button>
            </div>
          }>
            <div className="space-y-4">
              {licenses.map((license) => (
                <div key={license.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2">{license.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">الجهة المصدرة: </span>
                          <span className="font-medium">{license.issuer}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">تاريخ الإصدار: </span>
                          <span className="font-medium">{license.issueDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">تاريخ الانتهاء: </span>
                          <span className="font-medium">{license.expiryDate}</span>
                        </div>
                      </div>
                      {license.renewalDue > 0 && (
                        <div className="text-sm text-blue-600">
                          باقي {license.renewalDue} يوم على التجديد
                        </div>
                      )}
                      {license.renewalDue < 0 && (
                        <div className="text-sm text-red-600">
                          متأخر عن التجديد بـ {Math.abs(license.renewalDue)} يوم
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        license.status === 'نشط' ? 'bg-green-100 text-green-800' :
                        license.status === 'يتطلب تجديد' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {license.status}
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {license.type}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">عرض المستند</Button>
                    <Button size="sm" variant="outline">تجديد</Button>
                    <Button size="sm" variant="outline">تنبيهات</Button>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="ip" className="space-y-6">
          {/* IP Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <Copyright className="w-8 h-8 mx-auto text-purple-600" />
                <div className="text-2xl font-bold text-gray-800">15</div>
                <div className="text-sm text-gray-600">حقوق الملكية الفكرية</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <Award className="w-8 h-8 mx-auto text-blue-600" />
                <div className="text-2xl font-bold text-gray-800">8</div>
                <div className="text-sm text-gray-600">العلامات التجارية</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <FileText className="w-8 h-8 mx-auto text-green-600" />
                <div className="text-2xl font-bold text-gray-800">5</div>
                <div className="text-sm text-gray-600">براءات الاختراع</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-orange-600" />
                <div className="text-2xl font-bold text-gray-800">12</div>
                <div className="text-sm text-gray-600">حقوق الطبع والنشر</div>
              </div>
            </BaseCard>
          </div>

          {/* IP Portfolio */}
          <BaseCard size="lg" header={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-arabic font-bold text-gray-800">محفظة الملكية الفكرية</h3>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                تسجيل حق جديد
              </Button>
            </div>
          }>
            <div className="space-y-4">
              {intellectualProperty.map((ip) => (
                <div key={ip.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2">{ip.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">رقم التسجيل: </span>
                          <span className="font-medium">{ip.registrationNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">تاريخ التسجيل: </span>
                          <span className="font-medium">{ip.registrationDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">المنطقة: </span>
                          <span className="font-medium">{ip.region}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ip.status === 'مُسجل' ? 'bg-green-100 text-green-800' :
                        ip.status === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ip.status}
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {ip.type}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">تفاصيل التسجيل</Button>
                    <Button size="sm" variant="outline">المستندات</Button>
                    <Button size="sm" variant="outline">تجديد</Button>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          {/* Applications Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <Clock className="w-8 h-8 mx-auto text-blue-600" />
                <div className="text-2xl font-bold text-gray-800">12</div>
                <div className="text-sm text-gray-600">الطلبات الجارية</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-green-600" />
                <div className="text-2xl font-bold text-gray-800">8</div>
                <div className="text-sm text-gray-600">طلبات مكتملة</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-yellow-600" />
                <div className="text-2xl font-bold text-gray-800">3</div>
                <div className="text-sm text-gray-600">تتطلب متابعة</div>
              </div>
            </BaseCard>

            <BaseCard size="md" className="text-center">
              <div className="space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-purple-600" />
                <div className="text-2xl font-bold text-gray-800">45</div>
                <div className="text-sm text-gray-600">متوسط أيام المعالجة</div>
              </div>
            </BaseCard>
          </div>

          {/* Applications List */}
          <BaseCard size="lg" header={
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-arabic font-bold text-gray-800">الطلبات والمعاملات الجارية</h3>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                طلب جديد
              </Button>
            </div>
          }>
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2">{application.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">تاريخ التقديم: </span>
                          <span className="font-medium">{application.submissionDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">الإنجاز المتوقع: </span>
                          <span className="font-medium">{application.expectedCompletion}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        application.status === 'قيد المعالجة' ? 'bg-blue-100 text-blue-800' :
                        application.status === 'تحت المراجعة' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {application.status}
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {application.type}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">تتبع الطلب</Button>
                    <Button size="sm" variant="outline">المستندات</Button>
                    <Button size="sm" variant="outline">التواصل</Button>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
