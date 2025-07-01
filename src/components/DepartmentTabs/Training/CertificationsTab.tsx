
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Users, BookOpen, CheckCircle, Star, Plus, Download, Eye } from 'lucide-react';
import { mockCertificates, mockEmployeeSkillMatrix } from './data';

export const CertificationsTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('certificates');
  const certificates = mockCertificates;
  const skillMatrix = mockEmployeeSkillMatrix;

  // Digital certificates templates
  const certificateTemplates = [
    {
      id: 1,
      name: 'شهادة إتمام الدورة التدريبية',
      type: 'completion',
      design: 'classic',
      usage: 45
    },
    {
      id: 2,
      name: 'شهادة التميز في الأداء',
      type: 'excellence',
      design: 'modern',
      usage: 12
    },
    {
      id: 3,
      name: 'شهادة المشاركة في الورشة',
      type: 'participation',
      design: 'minimal',
      usage: 28
    }
  ];

  const CertificatesManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">إدارة الشهادات الرقمية</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إنشاء شهادة جديدة
        </Button>
      </div>

      {/* Certificate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{certificates.length}</div>
            <div className="text-sm text-gray-600">شهادات صادرة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{certificates.filter(c => c.status === 'issued').length}</div>
            <div className="text-sm text-gray-600">شهادات مفعلة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{certificateTemplates.length}</div>
            <div className="text-sm text-gray-600">قوالب الشهادات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Download className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">234</div>
            <div className="text-sm text-gray-600">تحميلات الشهادات</div>
          </CardContent>
        </Card>
      </div>

      {/* Certificate Templates */}
      <Card>
        <CardHeader>
          <CardTitle>قوالب الشهادات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {certificateTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-3 flex items-center justify-center">
                    <Award className="h-12 w-12 text-blue-600" />
                  </div>
                  <h4 className="font-medium mb-2">{template.name}</h4>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                    <Badge variant="outline">
                      {template.type === 'completion' ? 'إتمام' :
                       template.type === 'excellence' ? 'تميز' : 'مشاركة'}
                    </Badge>
                    <span>{template.usage} استخدام</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      معاينة
                    </Button>
                    <Button size="sm" className="flex-1">تحرير</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issued Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>الشهادات الصادرة مؤخراً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificates.slice(0, 5).map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Award className="h-8 w-8 text-yellow-600" />
                  <div>
                    <h4 className="font-medium">موظف {cert.studentId}</h4>
                    <p className="text-sm text-gray-600">دورة {cert.courseId}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={cert.status === 'issued' ? 'default' : 'secondary'}>
                        {cert.status === 'issued' ? 'صادرة' : 'معلقة'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(cert.issuedDate).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    عرض
                  </Button>
                  <Button size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    تحميل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SkillsMatrix = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">مصفوفة المهارات</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة مهارة جديدة
        </Button>
      </div>

      {/* Skills Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{skillMatrix.length}</div>
            <div className="text-sm text-gray-600">ملفات المهارات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {Math.round(skillMatrix.reduce((acc, emp) => 
                acc + emp.skills.reduce((skillAcc, skill) => skillAcc + skill.level, 0) / emp.skills.length, 0
              ) / skillMatrix.length)}%
            </div>
            <div className="text-sm text-gray-600">متوسط المهارات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {skillMatrix.filter(emp => 
                emp.skills.some(skill => skill.level >= 80)
              ).length}
            </div>
            <div className="text-sm text-gray-600">خبراء</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {skillMatrix.filter(emp => 
                emp.skills.some(skill => skill.level < 50)
              ).length}
            </div>
            <div className="text-sm text-gray-600">يحتاجون تطوير</div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle>مصفوفة مهارات الموظفين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillMatrix.map((employee) => (
              <Card key={employee.employeeId} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-medium">موظف {employee.employeeId}</h4>
                    <p className="text-sm text-gray-600">{employee.department} - {employee.position}</p>
                  </div>
                  <Badge variant="outline">
                    متوسط المهارات: {Math.round(employee.skills.reduce((acc, skill) => acc + skill.level, 0) / employee.skills.length)}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employee.skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-gray-600">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                      <div className="text-xs text-gray-500">
                        آخر تحديث: {new Date(skill.lastUpdated).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">عرض التفاصيل</Button>
                  <Button size="sm">تحديث المهارات</Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">الشهادات والمهارات</h3>
          <p className="text-gray-600">إدارة الشهادات الرقمية ومصفوفة المهارات مع ربطها بملفات الموظفين</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">تصدير التقرير</Button>
          <Button>إعدادات الشهادات</Button>
        </div>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="certificates">الشهادات الرقمية</TabsTrigger>
          <TabsTrigger value="skills">مصفوفة المهارات</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-6">
          <CertificatesManagement />
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <SkillsMatrix />
        </TabsContent>
      </Tabs>
    </div>
  );
};
