
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Building, Users, FileText, Plus, ExternalLink, Award, BookOpen } from 'lucide-react';

export const PartnershipsTab: React.FC = () => {
  const [activeView, setActiveView] = useState('universities');

  // Mock partnerships data
  const universityPartners = [
    {
      id: 1,
      name: 'جامعة الملك سعود',
      type: 'university',
      status: 'active',
      partnership_type: 'research_collaboration',
      programs: 3,
      students: 45,
      research_projects: 2,
      start_date: '2023-01-15',
      contact_person: 'د. أحمد المحمد'
    },
    {
      id: 2,
      name: 'جامعة الأمير سلطان',
      type: 'university',
      status: 'active',
      partnership_type: 'joint_certification',
      programs: 2,
      students: 28,
      research_projects: 1,
      start_date: '2023-06-20',
      contact_person: 'د. فاطمة العلي'
    },
    {
      id: 3,
      name: 'معهد الإدارة العامة',
      type: 'institute',
      status: 'pending',
      partnership_type: 'training_accreditation',
      programs: 1,
      students: 0,
      research_projects: 0,
      start_date: '2024-01-01',
      contact_person: 'أ. خالد السعدون'
    }
  ];

  const researchCenters = [
    {
      id: 1,
      name: 'مركز الدراسات الاستراتيجية',
      focus_area: 'Brand Strategy Research',
      current_projects: 2,
      publications: 5,
      status: 'active'
    },
    {
      id: 2,
      name: 'مركز أبحاث السلوك الاستهلاكي',
      focus_area: 'Consumer Behavior Analysis',
      current_projects: 3,
      publications: 8,
      status: 'active'
    }
  ];

  const jointPrograms = [
    {
      id: 1,
      title: 'ماجستير علم اجتماع العلامة التجارية',
      partner: 'جامعة الملك سعود',
      type: 'degree',
      duration: '24 شهر',
      status: 'active',
      enrolled_students: 25,
      graduation_rate: 92
    },
    {
      id: 2,
      title: 'دبلوم تحليل السلوك الاستهلاكي',
      partner: 'جامعة الأمير سلطان',
      type: 'diploma',
      duration: '12 شهر',
      status: 'active',
      enrolled_students: 18,
      graduation_rate: 87
    }
  ];

  const UniversitiesView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">الشراكات الجامعية</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة شراكة جديدة
        </Button>
      </div>

      {/* Partnership Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{universityPartners.length}</div>
            <div className="text-sm text-gray-600">شراكات جامعية</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{universityPartners.reduce((acc, p) => acc + p.students, 0)}</div>
            <div className="text-sm text-gray-600">طلاب مسجلون</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{universityPartners.reduce((acc, p) => acc + p.programs, 0)}</div>
            <div className="text-sm text-gray-600">برامج مشتركة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{universityPartners.reduce((acc, p) => acc + p.research_projects, 0)}</div>
            <div className="text-sm text-gray-600">مشاريع بحثية</div>
          </CardContent>
        </Card>
      </div>

      {/* Partners List */}
      <div className="space-y-4">
        {universityPartners.map((partner) => (
          <Card key={partner.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">{partner.name}</h4>
                    <Badge variant={partner.type === 'university' ? 'default' : 'secondary'}>
                      {partner.type === 'university' ? 'جامعة' : 'معهد'}
                    </Badge>
                    <Badge variant={partner.status === 'active' ? 'default' : 'outline'}>
                      {partner.status === 'active' ? 'نشط' : 'في الانتظار'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">نوع الشراكة:</span>
                      <div className="font-medium">
                        {partner.partnership_type === 'research_collaboration' ? 'تعاون بحثي' :
                         partner.partnership_type === 'joint_certification' ? 'شهادة مشتركة' : 'اعتماد تدريبي'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">البرامج:</span>
                      <div className="font-medium">{partner.programs}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">الطلاب:</span>
                      <div className="font-medium">{partner.students}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">المشاريع البحثية:</span>
                      <div className="font-medium">{partner.research_projects}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>تاريخ البداية: {new Date(partner.start_date).toLocaleDateString('ar-SA')}</span>
                    <span>جهة الاتصال: {partner.contact_person}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    عرض
                  </Button>
                  <Button size="sm">تعديل</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const ResearchView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">مراكز البحث</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة مركز بحثي
        </Button>
      </div>

      {/* Research Centers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {researchCenters.map((center) => (
          <Card key={center.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold mb-2">{center.name}</h4>
                  <Badge variant="outline">{center.focus_area}</Badge>
                </div>
                <Badge variant="default">نشط</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">المشاريع الحالية:</span>
                  <span className="font-medium">{center.current_projects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">المنشورات:</span>
                  <span className="font-medium">{center.publications}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">عرض المشاريع</Button>
                <Button size="sm" className="flex-1">إدارة</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Research Projects */}
      <Card>
        <CardHeader>
          <CardTitle>المشاريع البحثية النشطة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">تأثير وسائل التواصل الاجتماعي على إدراك العلامة التجارية</h4>
                <Badge variant="default">قيد التنفيذ</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                دراسة شاملة لتأثير منصات التواصل الاجتماعي على كيفية إدراك المستهلكين للعلامات التجارية
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">مركز الدراسات الاستراتيجية</span>
                <div className="flex items-center gap-2">
                  <Progress value={65} className="w-20 h-2" />
                  <span className="text-sm">65%</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">نماذج السلوك الاستهلاكي في المملكة العربية السعودية</h4>
                <Badge variant="secondary">في المراجعة</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                تحليل أنماط السلوك الاستهلاكي وتطوير نماذج تنبؤية للسوق السعودي
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">مركز أبحاث السلوك الاستهلاكي</span>
                <div className="flex items-center gap-2">
                  <Progress value={90} className="w-20 h-2" />
                  <span className="text-sm">90%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ProgramsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">البرامج المشتركة</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إنشاء برنامج مشترك
        </Button>
      </div>

      {/* Joint Programs */}
      <div className="space-y-4">
        {jointPrograms.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">{program.title}</h4>
                    <Badge variant={program.type === 'degree' ? 'default' : 'secondary'}>
                      {program.type === 'degree' ? 'درجة علمية' : 'دبلوم'}
                    </Badge>
                    <Badge variant="default">نشط</Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">بالشراكة مع {program.partner}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">المدة:</span>
                      <div className="font-medium">{program.duration}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">الطلاب المسجلون:</span>
                      <div className="font-medium">{program.enrolled_students}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">معدل التخرج:</span>
                      <div className="font-medium">{program.graduation_rate}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500">الحالة:</span>
                      <div className="font-medium text-green-600">متاح للتسجيل</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">عرض التفاصيل</Button>
                  <Button size="sm">إدارة البرنامج</Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">تقدم الدفعة الحالية</span>
                  <div className="flex items-center gap-2">
                    <Progress value={60} className="w-32 h-2" />
                    <span className="text-sm">60%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accreditation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            حالة الاعتماد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">الاعتمادات المحلية</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">وزارة التعليم</span>
                  <Badge variant="default">معتمد</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">المركز الوطني للتعليم الإلكتروني</span>
                  <Badge variant="default">معتمد</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">هيئة تقويم التعليم والتدريب</span>
                  <Badge variant="outline">في المراجعة</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">الاعتمادات الدولية</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">AACSB International</span>
                  <Badge variant="outline">قيد التقديم</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">EFMD (EQUIS)</span>
                  <Badge variant="outline">مخطط له</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">الشراكات الأكاديمية</h3>
          <p className="text-gray-600">إدارة الشراكات مع الجامعات ومراكز البحث لبرامج الاعتماد المشتركة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">تصدير التقرير</Button>
          <Button>إعدادات الشراكات</Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeView === 'universities' ? 'default' : 'outline'}
          onClick={() => setActiveView('universities')}
          className="flex items-center gap-2"
        >
          <GraduationCap className="h-4 w-4" />
          الجامعات
        </Button>
        <Button
          variant={activeView === 'research' ? 'default' : 'outline'}
          onClick={() => setActiveView('research')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          مراكز البحث
        </Button>
        <Button
          variant={activeView === 'programs' ? 'default' : 'outline'}
          onClick={() => setActiveView('programs')}
          className="flex items-center gap-2"
        >
          <Award className="h-4 w-4" />
          البرامج المشتركة
        </Button>
      </div>

      {/* Content based on active view */}
      {activeView === 'universities' && <UniversitiesView />}
      {activeView === 'research' && <ResearchView />}
      {activeView === 'programs' && <ProgramsView />}
    </div>
  );
};
