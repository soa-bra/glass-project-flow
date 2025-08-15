import React from 'react';
import { BaseProjectTabLayout } from '../BaseProjectTabLayout';
import { BaseCard } from '@/components/shared/BaseCard';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { FileText, Plus, Copy, Edit, Star } from 'lucide-react';

interface TemplatesTabProps {
  templates?: any;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({ templates }) => {
  const templateStats = [
    {
      title: 'القوالب المتاحة',
      value: '24',
      unit: 'قالب',
      description: 'جميع القوالب في المشروع'
    },
    {
      title: 'المستخدمة',
      value: '16',
      unit: 'قالب',
      description: 'القوالب المستخدمة فعلياً'
    },
    {
      title: 'القوالب المخصصة',
      value: '8',
      unit: 'قالب',
      description: 'تم إنشاؤها خصيصاً للمشروع'
    },
    {
      title: 'معدل الاستخدام',
      value: '67',
      unit: '%',
      description: 'من إجمالي القوالب'
    }
  ];

  const templateCategories = [
    {
      name: 'قوالب المهام',
      description: 'قوالب جاهزة لإنشاء أنواع مختلفة من المهام',
      templates: [
        { name: 'مهمة تطوير ميزة', type: 'task', complexity: 'متوسط' },
        { name: 'مهمة إصلاح خطأ', type: 'task', complexity: 'بسيط' },
        { name: 'مهمة مراجعة كود', type: 'task', complexity: 'بسيط' },
        { name: 'مهمة اختبار', type: 'task', complexity: 'متوسط' }
      ]
    },
    {
      name: 'قوالب التقارير',
      description: 'قوالب لإنشاء تقارير منتظمة ومتخصصة',
      templates: [
        { name: 'تقرير التقدم الأسبوعي', type: 'report', complexity: 'بسيط' },
        { name: 'تقرير مالي شهري', type: 'report', complexity: 'معقد' },
        { name: 'تقرير أداء الفريق', type: 'report', complexity: 'متوسط' },
        { name: 'تقرير رضا العميل', type: 'report', complexity: 'متوسط' }
      ]
    },
    {
      name: 'قوالب الاجتماعات',
      description: 'قوالب لتنظيم أنواع مختلفة من الاجتماعات',
      templates: [
        { name: 'اجتماع فريق أسبوعي', type: 'meeting', complexity: 'بسيط' },
        { name: 'مراجعة مرحلة مشروع', type: 'meeting', complexity: 'متوسط' },
        { name: 'عرض على العميل', type: 'meeting', complexity: 'معقد' },
        { name: 'جلسة عصف ذهني', type: 'meeting', complexity: 'بسيط' }
      ]
    }
  ];

  const recentlyUsed = [
    { name: 'مهمة تطوير ميزة', usedBy: 'محمد أحمد', lastUsed: '2024-01-25', frequency: 12 },
    { name: 'تقرير التقدم الأسبوعي', usedBy: 'فاطمة علي', lastUsed: '2024-01-24', frequency: 8 },
    { name: 'اجتماع فريق أسبوعي', usedBy: 'عبدالله سالم', lastUsed: '2024-01-23', frequency: 15 }
  ];

  return (
    <BaseProjectTabLayout
      value="templates"
      title="النماذج والقوالب"
      icon={<FileText className="w-4 h-4" />}
      kpiStats={templateStats}
    >
      {/* Template Actions */}
      <BaseCard title="إدارة القوالب" icon={<Plus className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-4">
          <BaseActionButton 
            variant="primary" 
            icon={<Plus className="w-4 h-4" />}
          >
            إنشاء قالب جديد
          </BaseActionButton>
          <BaseActionButton 
            variant="outline" 
            icon={<Copy className="w-4 h-4" />}
          >
            استيراد قالب
          </BaseActionButton>
          <BaseActionButton 
            variant="secondary" 
            icon={<Edit className="w-4 h-4" />}
          >
            تعديل قالب موجود
          </BaseActionButton>
          <BaseActionButton 
            variant="ghost" 
            icon={<Star className="w-4 h-4" />}
          >
            القوالب المفضلة
          </BaseActionButton>
        </div>
      </BaseCard>

      {/* Template Categories */}
      {templateCategories.map((category, categoryIndex) => (
        <BaseCard 
          key={categoryIndex} 
          title={category.name} 
          icon={<FileText className="w-4 h-4" />}
        >
          <p className="text-sm text-gray-600 mb-4">{category.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {category.templates.map((template, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-800">{template.name}</h4>
                  <BaseBadge 
                    variant={
                      template.complexity === 'بسيط' ? 'success' :
                      template.complexity === 'متوسط' ? 'warning' : 'error'
                    }
                    size="sm"
                  >
                    {template.complexity}
                  </BaseBadge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">
                    {template.type === 'task' ? 'مهمة' :
                     template.type === 'report' ? 'تقرير' : 'اجتماع'}
                  </span>
                  <div className="flex items-center gap-1">
                    <BaseActionButton variant="ghost" size="sm">
                      <Copy className="w-3 h-3" />
                    </BaseActionButton>
                    <BaseActionButton variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
                    </BaseActionButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>
      ))}

      {/* Recently Used Templates */}
      <BaseCard title="القوالب المستخدمة مؤخراً" icon={<Star className="w-4 h-4" />}>
        <div className="space-y-3">
          {recentlyUsed.map((template, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-800">{template.name}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>استخدمه {template.usedBy}</span>
                  <span>•</span>
                  <span>{template.lastUsed}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500">مرات الاستخدام</p>
                  <p className="text-sm font-bold text-blue-600">{template.frequency}</p>
                </div>
                <BaseActionButton variant="primary" size="sm">
                  استخدام
                </BaseActionButton>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      {/* Template Statistics */}
      <BaseCard title="إحصائيات القوالب" icon={<FileText className="w-4 h-4" />}>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-2">الأكثر استخداماً</h4>
            <p className="text-lg font-bold text-green-600">مهمة تطوير ميزة</p>
            <p className="text-xs text-gray-500">15 مرة هذا الشهر</p>
          </div>
          
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-2">الأحدث</h4>
            <p className="text-lg font-bold text-blue-600">قالب مراجعة أمان</p>
            <p className="text-xs text-gray-500">تم الإنشاء أمس</p>
          </div>
          
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-2">متوسط الاستخدام</h4>
            <p className="text-lg font-bold text-purple-600">8.3 مرة</p>
            <p className="text-xs text-gray-500">لكل قالب شهرياً</p>
          </div>
        </div>
      </BaseCard>
    </BaseProjectTabLayout>
  );
};