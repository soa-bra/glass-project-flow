import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { NumericStatCard } from '@/components/shared/visual-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Eye, Edit, Plus, Search, Filter, BookOpen, Award, ClipboardList } from 'lucide-react';

export const TemplatesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('course');

  const courseTemplates = [
    { id: 1, name: 'قالب الدورة التدريبية الأساسية', type: 'course_basic', description: 'قالب شامل لإنشاء دورة تدريبية تتضمن الأهداف والمحتوى والتقييم', usage_count: 45, last_updated: '2024-02-15', status: 'active' },
    { id: 2, name: 'قالب الدورة المتقدمة', type: 'course_advanced', description: 'قالب للدورات المتخصصة مع وحدات متقدمة وتقييمات معقدة', usage_count: 23, last_updated: '2024-02-10', status: 'active' },
    { id: 3, name: 'قالب ورشة العمل التفاعلية', type: 'workshop', description: 'قالب مخصص لورش العمل التفاعلية مع أنشطة جماعية', usage_count: 31, last_updated: '2024-02-20', status: 'active' },
  ];

  const certificateTemplates = [
    { id: 1, name: 'شهادة إتمام الدورة التدريبية', type: 'completion', description: 'شهادة رسمية لإتمام الدورات التدريبية', usage_count: 156, last_updated: '2024-02-12', status: 'active' },
    { id: 2, name: 'شهادة التميز في الأداء', type: 'excellence', description: 'شهادة تقدير للمتدربين المتميزين', usage_count: 42, last_updated: '2024-02-08', status: 'active' },
    { id: 3, name: 'شهادة المشاركة في الورشة', type: 'participation', description: 'شهادة مشاركة في ورش العمل', usage_count: 89, last_updated: '2024-02-18', status: 'active' },
  ];

  const assessmentTemplates = [
    { id: 1, name: 'نموذج التقييم الأولي', type: 'pre_assessment', description: 'تقييم مستوى المتدرب قبل بدء الدورة', usage_count: 67, last_updated: '2024-02-14', status: 'active' },
    { id: 2, name: 'نموذج التقييم النهائي', type: 'final_assessment', description: 'تقييم شامل لقياس مخرجات التعلم', usage_count: 73, last_updated: '2024-02-16', status: 'active' },
    { id: 3, name: 'نموذج تحليل الاحتياج التدريبي', type: 'needs_analysis', description: 'تحليل احتياجات التدريب للأفراد والمجموعات', usage_count: 38, last_updated: '2024-02-11', status: 'active' },
  ];

  const typeLabels: Record<string, string> = {
    course_basic: 'دورة أساسية', course_advanced: 'دورة متقدمة', workshop: 'ورشة عمل',
    completion: 'إتمام', excellence: 'تميز', participation: 'مشاركة',
    pre_assessment: 'تقييم أولي', final_assessment: 'تقييم نهائي', needs_analysis: 'تحليل احتياج',
  };

  const TemplateCard = ({ template }: { template: typeof courseTemplates[0] }) => (
    <BaseBox>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-sm font-bold font-arabic text-[#0B0F12] mb-1">{template.name}</h4>
          <BaseBadge variant="outline" size="sm">{typeLabels[template.type] || template.type}</BaseBadge>
        </div>
        <BaseBadge variant={template.status === 'active' ? 'success' : 'secondary'} size="sm">
          {template.status === 'active' ? 'نشط' : 'معطل'}
        </BaseBadge>
      </div>
      <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic mb-3">{template.description}</p>
      <div className="flex justify-between items-center text-[10px] text-[rgba(11,15,18,0.40)] font-arabic mb-3">
        <span>{template.usage_count} استخدام</span>
        <span>آخر تحديث: {new Date(template.last_updated).toLocaleDateString('ar-SA')}</span>
      </div>
      <div className="flex gap-2">
        <BaseActionButton variant="outline" size="sm" icon={<Eye className="w-3 h-3" />}>معاينة</BaseActionButton>
        <BaseActionButton variant="outline" size="sm" icon={<Edit className="w-3 h-3" />}>تعديل</BaseActionButton>
        <BaseActionButton variant="primary" size="sm" icon={<Download className="w-3 h-3" />}>استخدام</BaseActionButton>
      </div>
    </BaseBox>
  );

  const BuilderSection = ({ title, description, icon: Icon, steps, buttonText }: any) => (
    <BaseBox>
      <div className="text-center py-6">
        <Icon className="h-12 w-12 text-[rgba(11,15,18,0.20)] mx-auto mb-3" />
        <h3 className="text-sm font-bold font-arabic text-[#0B0F12] mb-1">{title}</h3>
        <p className="text-[11px] text-[rgba(11,15,18,0.50)] font-arabic mb-4">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {steps.map((step: any, i: number) => (
            <div key={i} className="p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
              <h4 className="text-[12px] font-bold font-arabic text-[#0B0F12] mb-1">{step.title}</h4>
              <p className="text-[10px] text-[rgba(11,15,18,0.40)] font-arabic">{step.desc}</p>
            </div>
          ))}
        </div>
        <BaseActionButton variant="primary" size="md">{buttonText}</BaseActionButton>
      </div>
    </BaseBox>
  );

  const totalUsage = [...courseTemplates, ...certificateTemplates, ...assessmentTemplates].reduce((a, t) => a + t.usage_count, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">النماذج والقوالب</span>
          <p className="text-[11px] text-[rgba(11,15,18,0.40)] font-arabic mt-1">قوالب للدورات والشهادات والتقييمات</p>
        </div>
        <div className="flex gap-2">
          <BaseActionButton variant="outline" size="sm" icon={<Search className="w-4 h-4" />}>بحث</BaseActionButton>
          <BaseActionButton variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>فلترة</BaseActionButton>
        </div>
      </div>

      <AppDashboardGrid columns={12}>
        <AppGridItem colSpan={3}><NumericStatCard title="قوالب الدورات" value={courseTemplates.length} description="قالب متاح" accentColor="#a4e2f6" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="قوالب الشهادات" value={certificateTemplates.length} description="قالب متاح" accentColor="#fbe2aa" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="قوالب التقييم" value={assessmentTemplates.length} description="قالب متاح" accentColor="#bdeed3" /></AppGridItem>
        <AppGridItem colSpan={3}><NumericStatCard title="إجمالي الاستخدامات" value={totalUsage} description="استخدام" accentColor="#d9d2fd" /></AppGridItem>
      </AppDashboardGrid>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-3 rounded-full bg-[rgba(11,15,18,0.04)] p-1">
          <TabsTrigger value="course" className="rounded-full text-[12px] font-arabic">قوالب الدورات</TabsTrigger>
          <TabsTrigger value="certificate" className="rounded-full text-[12px] font-arabic">قوالب الشهادات</TabsTrigger>
          <TabsTrigger value="assessment" className="rounded-full text-[12px] font-arabic">قوالب التقييم</TabsTrigger>
        </TabsList>

        <TabsContent value="course" className="space-y-5 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase">قوالب الدورات</span>
            <BaseActionButton variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>إنشاء قالب جديد</BaseActionButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseTemplates.map(t => <TemplateCard key={t.id} template={t} />)}
          </div>
          <BuilderSection title="أداة إنشاء قوالب الدورات" description="أنشئ قوالب دورات مخصصة تشمل الهيكل والمحتوى والتقييمات" icon={BookOpen} buttonText="بدء إنشاء قالب دورة"
            steps={[{ title: 'تحديد الهيكل', desc: 'حدد الوحدات والدروس والأنشطة' }, { title: 'إضافة المحتوى', desc: 'أضف النصوص والوسائط والموارد' }, { title: 'تصميم التقييم', desc: 'أنشئ الاختبارات والمهام' }]} />
        </TabsContent>

        <TabsContent value="certificate" className="space-y-5 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase">قوالب الشهادات</span>
            <BaseActionButton variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>تصميم شهادة جديدة</BaseActionButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificateTemplates.map(t => <TemplateCard key={t.id} template={t} />)}
          </div>
          <BuilderSection title="مصمم الشهادات الرقمية" description="صمم شهادات رقمية احترافية قابلة للتحقق مع عناصر الأمان" icon={Award} buttonText="بدء تصميم شهادة"
            steps={[{ title: 'اختيار التصميم', desc: 'قوالب جاهزة ومخصصة' }, { title: 'إضافة المحتوى', desc: 'النصوص والشعارات' }, { title: 'عناصر الأمان', desc: 'التوقيع الرقمي والQR' }]} />
        </TabsContent>

        <TabsContent value="assessment" className="space-y-5 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase">قوالب التقييم</span>
            <BaseActionButton variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>إنشاء نموذج تقييم</BaseActionButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assessmentTemplates.map(t => <TemplateCard key={t.id} template={t} />)}
          </div>
          <BuilderSection title="أداة إنشاء التقييمات" description="أنشئ اختبارات ونماذج تقييم تفاعلية مع أنواع أسئلة متنوعة" icon={ClipboardList} buttonText="بدء إنشاء تقييم"
            steps={[{ title: 'أنواع الأسئلة', desc: 'اختيار متعدد، مقالي، صح/خطأ' }, { title: 'نظام التقدير', desc: 'درجات مرنة ومعايير تقييم' }, { title: 'التحليل التلقائي', desc: 'إحصائيات وتقارير فورية' }]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
