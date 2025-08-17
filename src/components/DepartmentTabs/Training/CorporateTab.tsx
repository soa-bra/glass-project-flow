import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Calendar, DollarSign, Plus, Eye, Edit, FileText } from 'lucide-react';
import { mockCorporatePrograms } from './data';

export const CorporateTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('programs');
  const corporatePrograms = mockCorporatePrograms;

  // Mock client data
  const corporateClients = [
    {
      id: 1,
      name: 'شركة النهضة للتطوير',
      industry: 'العقارات',
      size: 'كبيرة',
      activeProgramsCount: 3,
      totalInvestment: 450000,
      status: 'active'
    },
    {
      id: 2,
      name: 'مجموعة الرائد التجارية',
      industry: 'التجارة',
      size: 'متوسطة',
      activeProgramsCount: 2,
      totalInvestment: 180000,
      status: 'active'
    },
    {
      id: 3,
      name: 'معهد الابتكار التقني',
      industry: 'التعليم',
      size: 'صغيرة',
      activeProgramsCount: 1,
      totalInvestment: 75000,
      status: 'pending'
    }
  ];

  const ProgramsManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">إدارة البرامج المؤسسية</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إنشاء برنامج جديد
        </Button>
      </div>

      {/* Programs Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{corporatePrograms.length}</div>
            <div className="text-sm text-gray-600">برامج نشطة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{corporatePrograms.reduce((acc, p) => acc + p.participantCount, 0)}</div>
            <div className="text-sm text-gray-600">إجمالي المشاركين</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{(corporatePrograms.reduce((acc, p) => acc + p.contractValue, 0) / 1000).toFixed(0)}k</div>
            <div className="text-sm text-gray-600">القيمة الإجمالية (ر.س)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{corporatePrograms.filter(p => p.status === 'in_progress').length}</div>
            <div className="text-sm text-gray-600">قيد التنفيذ</div>
          </CardContent>
        </Card>
      </div>

      {/* Programs List */}
      <div className="grid grid-cols-1 gap-6">
        {corporatePrograms.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">{program.title}</h4>
                    <Badge variant="default">برنامج تدريبي</Badge>
                    <Badge variant={
                      program.status === 'in_progress' ? 'default' :
                      program.status === 'completed' ? 'secondary' : 'outline'
                    }>
                      {program.status === 'in_progress' ? 'نشط' :
                       program.status === 'completed' ? 'مكتمل' : 
                       program.status === 'contracted' ? 'متعاقد' : 'مقترح'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{program.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">العميل:</span>
                      <div className="font-medium">عميل {program.clientId}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">المدة:</span>
                      <div className="font-medium">6 أشهر</div>
                    </div>
                    <div>
                      <span className="text-gray-500">المشاركون:</span>
                      <div className="font-medium">{program.participantCount} شخص</div>
                    </div>
                    <div>
                      <span className="text-gray-500">القيمة:</span>
                      <div className="font-medium">{program.contractValue.toLocaleString()} ر.س</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm text-gray-500">تاريخ البداية</div>
                    <div className="font-medium">{new Date(program.startDate).toLocaleDateString('ar-SA')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">تاريخ الانتهاء</div>
                    <div className="font-medium">{new Date(program.endDate).toLocaleDateString('ar-SA')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">التقدم</div>
                    <div className="flex items-center gap-2">
                      <Progress value={program.status === 'completed' ? 100 : program.status === 'in_progress' ? 65 : 0} className="w-20 h-2" />
                      <span className="text-sm font-medium">{program.status === 'completed' ? 100 : program.status === 'in_progress' ? 65 : 0}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    عرض
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Edit className="h-3 w-3" />
                    تعديل
                  </Button>
                  <Button size="sm" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    التقرير
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const ClientsManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">إدارة العملاء المؤسسيين</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة عميل جديد
        </Button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {corporateClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold mb-1">{client.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{client.industry}</Badge>
                    <Badge variant="secondary">{client.size}</Badge>
                  </div>
                </div>
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                  {client.status === 'active' ? 'نشط' : 'في الانتظار'}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">البرامج النشطة:</span>
                  <span className="font-medium">{client.activeProgramsCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">إجمالي الاستثمار:</span>
                  <span className="font-medium">{client.totalInvestment.toLocaleString()} ر.س</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">عرض</Button>
                <Button size="sm" className="flex-1">تعديل</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {corporateClients.length}
              </div>
              <div className="text-sm text-gray-600">إجمالي العملاء</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {corporateClients.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">عملاء نشطون</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {(corporateClients.reduce((acc, c) => acc + c.totalInvestment, 0) / 1000).toFixed(0)}k
              </div>
              <div className="text-sm text-gray-600">إجمالي الإيرادات (ر.س)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const WorkshopsManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">إدارة ورش العمل المتخصصة</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          تصميم ورشة جديدة
        </Button>
      </div>

      {/* Workshop Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">ورشة التسويق الرقمي</h4>
              <p className="text-gray-600 text-sm mb-4">
                ورشة متخصصة في استراتيجيات التسويق الرقمي للشركات
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>المدة:</span>
                  <span>3 أيام</span>
                </div>
                <div className="flex justify-between">
                  <span>السعة:</span>
                  <span>20 مشارك</span>
                </div>
                <div className="flex justify-between">
                  <span>السعر:</span>
                  <span>15,000 ر.س</span>
                </div>
              </div>
              <Button className="w-full mt-4">عرض التفاصيل</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">ورشة القيادة التنفيذية</h4>
              <p className="text-gray-600 text-sm mb-4">
                تطوير مهارات القيادة والإدارة للمستويات التنفيذية
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>المدة:</span>
                  <span>5 أيام</span>
                </div>
                <div className="flex justify-between">
                  <span>السعة:</span>
                  <span>15 مشارك</span>
                </div>
                <div className="flex justify-between">
                  <span>السعر:</span>
                  <span>25,000 ر.س</span>
                </div>
              </div>
              <Button className="w-full mt-4">عرض التفاصيل</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">ورشة إدارة المشاريع</h4>
              <p className="text-gray-600 text-sm mb-4">
                منهجيات إدارة المشاريع وأفضل الممارسات
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>المدة:</span>
                  <span>4 أيام</span>
                </div>  
                <div className="flex justify-between">
                  <span>السعة:</span>
                  <span>25 مشارك</span>
                </div>
                <div className="flex justify-between">
                  <span>السعر:</span>
                  <span>18,000 ر.س</span>
                </div>
              </div>
              <Button className="w-full mt-4">عرض التفاصيل</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Workshop Builder */}
      <Card>
        <CardHeader>
          <CardTitle>مصمم ورش العمل المخصصة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">أداة تصميم ورش العمل</h3>
            <p className="text-gray-600 mb-6">
              صمم ورش عمل مخصصة لعملائك المؤسسيين بناءً على احتياجاتهم الخاصة
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">اختيار المحتوى</h4>
                <p className="text-sm text-gray-600">حدد المواضيع والمهارات المطلوبة</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">تخصيص المدة</h4>
                <p className="text-sm text-gray-600">حدد عدد الأيام والساعات التدريبية</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">حساب التكلفة</h4>
                <p className="text-sm text-gray-600">احسب السعر بناءً على المتطلبات</p>
              </div>
            </div>
            <Button size="lg">بدء تصميم ورشة مخصصة</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">البرامج المؤسسية</h3>
          <p className="text-gray-600">إدارة برامج التدريب الخارجي للعملاء وورش العمل المتخصصة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">تصدير التقرير</Button>
          <Button>إعدادات البرامج</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="programs">البرامج</TabsTrigger>
          <TabsTrigger value="clients">العملاء</TabsTrigger>
          <TabsTrigger value="workshops">ورش العمل</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-6">
          <ProgramsManagement />
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <ClientsManagement />
        </TabsContent>

        <TabsContent value="workshops" className="space-y-6">
          <WorkshopsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
