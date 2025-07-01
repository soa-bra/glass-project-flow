
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Eye, Edit, Plus, Search, Filter, BookOpen, Award, ClipboardList } from 'lucide-react';

export const TemplatesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('course');

  // Mock templates data
  const courseTemplates = [
    {
      id: 1,
      name: 'قالب الدورة التدريبية الأساسية',
      type: 'course_basic',
      category: 'course',
      description: 'قالب شامل لإنشاء دورة تدريبية تتضمن الأهداف والمحتوى والتقييم',
      usage_count: 45,
      last_updated: '2024-02-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'قالب الدورة المتقدمة',
      type: 'course_advanced',
      category: 'course',
      description: 'قالب للدورات المتخصصة مع وحدات متقدمة وتقييمات معقدة',
      usage_count: 23,
      last_updated: '2024-02-10',
      status: 'active'
    },
    {
      id: 3,
      name: 'قالب ورشة العمل التفاعلية',
      type: 'workshop',
      category: 'course',
      description: 'قالب مخصص لورش العمل التفاعلية مع أنشطة جماعية',
      usage_count: 31,
      last_updated: '2024-02-20',
      status: 'active'
    }
  ];

  const certificateTemplates = [
    {
      id: 1,
      name: 'شهادة إتمام الدورة التدريبية',
      type: 'completion',
      category: 'certificate',
      description: 'شهادة رسمية لإتمام الدورات التدريبية',
      usage_count: 156,
      last_updated: '2024-02-12',
      status: 'active'
    },
    {
      id: 2,
      name: 'شهادة التميز في الأداء',
      type: 'excellence',
      category: 'certificate',
      description: 'شهادة تقدير للمتدربين المتميزين',
      usage_count: 42,
      last_updated: '2024-02-08',
      status: 'active'
    },
    {
      id: 3,
      name: 'شهادة المشاركة في الورشة',
      type: 'participation',
      category: 'certificate',
      description: 'شهادة مشاركة في ورش العمل',
      usage_count: 89,
      last_updated: '2024-02-18',
      status: 'active'
    }
  ];

  const assessmentTemplates = [
    {
      id: 1,
      name: 'نموذج التقييم الأولي',
      type: 'pre_assessment',
      category: 'assessment',
      description: 'تقييم مستوى المتدرب قبل بدء الدورة',
      usage_count: 67,
      last_updated: '2024-02-14',
      status: 'active'
    },
    {
      id: 2,
      name: 'نموذج التقييم النهائي',
      type: 'final_assessment',
      category: 'assessment',  
      description: 'تقييم شامل لقياس مخرجات التعلم',
      usage_count: 73,
      last_updated: '2024-02-16',
      status: 'active'
    },
    {
      id: 3,
      name: 'نموذج تحليل الاحتياج التدريبي',
      type: 'needs_analysis',
      category: 'assessment',
      description: 'تحليل احتياجات التدريب للأفراد والمجموعات',
      usage_count: 38,
      last_updated: '2024-02-11',
      status: 'active'
    }
  ];

  const TemplateCard = ({ template, icon: Icon }: { template: any, icon: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">{template.name}</h4>
              <Badge variant="outline" className="mt-1">
                {template.type === 'course_basic' ? 'دورة أساسية' :
                 template.type === 'course_advanced' ? 'دورة متقدمة' :
                 template.type === 'workshop' ? 'ورشة عمل' :
                 template.type === 'completion' ? 'إتمام' :
                 template.type === 'excellence' ? 'تميز' :
                 template.type === 'participation' ? 'مشاركة' :
                 template.type === 'pre_assessment' ? 'تقييم أولي' :
                 template.type === 'final_assessment' ? 'تقييم نهائي' :
                 template.type === 'needs_analysis' ? 'تحليل احتياج' : template.type}
              </Badge>
            </div>
          </div>
          <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
            {template status === 'active' ? 'نشط' : 'معطل'}
          </Badge>
        </div>

        <p className="text-gray-600 text-sm mb-4">{template.description}</p>

        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>{template.usage_count} استخدام</span>
          <span>آخر تحديث: {new Date(template.last_updated).toLocaleDateString('ar-SA')}</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="h-3 w-3 mr-1" />
            معاينة
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Edit className="h-3 w-3 mr-1" />
            تعديل
          </Button>
          <Button size="sm" className="flex-1">
            <Download className="h-3 w-3 mr-1" />
            استخدام
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const CourseTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">قوالب الدورات</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إنشاء قالب جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} icon={BookOpen} />
        ))}
      </div>

      {/* Course Builder */}
      <Card>
        <CardHeader>
          <CardTitle>منشئ قوالب الدورات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">أداة إنشاء قوالب الدورات</h3>
            <p className="text-gray-600 mb-6">
              أنشئ قوالب دورات مخصصة تشمل الهيكل والمحتوى والتقييمات
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">تحديد الهيكل</h4>
                <p className="text-sm text-gray-600">حدد الوحدات والدروس والأنشطة</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">إضافة المحتوى</h4>
                <p className="text-sm text-gray-600">أضف النصوص والوسائط والموارد</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">تصميم التقييم</h4>
                <p className="text-sm text-gray-600">أنشئ الاختبارات والمهام</p>
              </div>
            </div>
            <Button size="lg">بدء إنشاء قالب دورة</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CertificateTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">قوالب الشهادات</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          تصميم شهادة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificateTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} icon={Award} />
        ))}
      </div>

      {/* Certificate Designer */}
      <Card>
        <CardHeader>
          <CardTitle>مصمم الشهادات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">مصمم الشهادات الرقمية</h3>
            <p className="text-gray-600 mb-6">
              صمم شهادات رقمية احترافية قابلة للتحقق مع عناصر الأمان
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">اختيار التصميم</h4>
                <p className="text-sm text-gray-600">قوالب جاهzة ومخصصة</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">إضافة المحتوى</h4>
                <p className="text-sm text-gray-600">النصوص والشعارات</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">عناصر الأمان</h4>
                <p className="text-sm text-gray-600">التوقيع الرقمي والQR</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">المعاينة والنشر</h4>
                <p className="text-sm text-gray-600">اختبار وتفعيل</p>
              </div>
            </div>
            <Button size="lg">بدء تصميم شهادة</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AssessmentTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">قوالب التقييم</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إنشاء نموذج تقييم
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessmentTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} icon={ClipboardList} />
        ))}
      </div>

      {/* Assessment Builder */}
      <Card>
        <CardHeader>
          <CardTitle>منشئ نماذج التقييم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ClipboardList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">أداة إنشاء التقييمات</h3>
            <p className="text-gray-600 mb-6">
              أنشئ اختبارات ونماذج تقييم تفاعلية مع أنواع أسئلة متنوعة
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">أنواع الأسئلة</h4>
                <p className="text-sm text-gray-600">اختيار متعدد، مقالي، صح/خطأ</p>
              </div>
              <div className="p-4 border rounded-lg">  
                <h4 className="font-medium mb-2">نظام التقدير</h4>
                <p className="text-sm text-gray-600">درجات مرنة ومعايير تقييم</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">التحليل التلقائي</h4>
                <p className="text-sm text-gray-600">إحصائيات وتقارير فورية</p>
              </div>
            </div>
            <Button size="lg">بدء إنشاء تقييم</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">النماذج والقوالب</h3>
          <p className="text-gray-600">قوالب للدورات والشهادات والتقييمات ونماذج تحليل الاحتياج التدريبي</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            بحث
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            فلترة
          </Button>
        </div>
      </div>

      {/* Templates Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{courseTemplates.length}</div>
            <div className="text-sm text-gray-600">قوالب الدورات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{certificateTemplates.length}</div>
            <div className="text-sm text-gray-600">قوالب الشهادات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ClipboardList className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{assessmentTemplates.length}</div>
            <div className="text-sm text-gray-600">قوالب التقييم</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {courseTemplates.reduce((acc, t) => acc + t.usage_count, 0) +
               certificateTemplates.reduce((acc, t) => acc + t.usage_count, 0) +
               assessmentTemplates.reduce((acc, t) => acc + t.usage_count, 0)}
            </div>
            <div className="text-sm text-gray-600">إجمالي الاستخدامات</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="course">قوالب الدورات</TabsTrigger>
          <TabsTrigger value="certificate">قوالب الشهادات</TabsTrigger>
          <TabsTrigger value="assessment">قوالب التقييم</TabsTrigger>
        </TabsList>

        <TabsContent value="course" className="space-y-6">
          <CourseTemplates />
        </TabsContent>

        <TabsContent value="certificate" className="space-y-6">
          <CertificateTemplates />
        </TabsContent>

        <TabsContent value="assessment" className="space-y-6">
          <AssessmentTemplates />
        </TabsContent>
      </Tabs>
    </div>
  );
};
