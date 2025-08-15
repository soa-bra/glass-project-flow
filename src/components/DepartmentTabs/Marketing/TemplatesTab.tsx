
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { FileText, Download, Eye, Copy, Plus, Search } from 'lucide-react';
import { UnifiedBadge, UnifiedButton } from '@/components/shared/components';

export const TemplatesTab: React.FC = () => {
  const templateCategories = [
    {
      name: 'حملات التسويق الرقمي',
      count: 12,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      name: 'البريد الإلكتروني',
      count: 8,
      icon: FileText,
      color: 'text-green-600'
    },
    {
      name: 'وسائل التواصل الاجتماعي',
      count: 15,
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      name: 'العروض التقديمية',
      count: 6,
      icon: FileText,
      color: 'text-orange-600'
    }
  ];

  const popularTemplates = [
    {
      name: 'قالب حملة إعلانية رقمية',
      category: 'التسويق الرقمي',
      downloads: 156,
      lastUpdated: '2024-01-15',
      status: 'محدث',
      type: 'PowerPoint'
    },
    {
      name: 'نموذج تقرير أداء الحملة',
      category: 'التقارير',
      downloads: 89,
      lastUpdated: '2024-01-10',
      status: 'محدث',
      type: 'Excel'
    },
    {
      name: 'قالب منشور وسائل التواصل',
      category: 'وسائل التواصل',
      downloads: 203,
      lastUpdated: '2024-01-08',
      status: 'محدث',
      type: 'PSD'
    },
    {
      name: 'نموذج طلب موافقة حملة',
      category: 'الموافقات',
      downloads: 67,
      lastUpdated: '2024-01-05',
      status: 'قديم',
      type: 'Word'
    }
  ];

  const recentTemplates = [
    {
      name: 'قالب استراتيجية المحتوى الشهرية',
      category: 'التخطيط',
      createdDate: '2024-01-12',
      createdBy: 'سارة أحمد',
      type: 'Excel'
    },
    {
      name: 'نموذج تحليل المنافسين',
      category: 'التحليل',
      createdDate: '2024-01-10',
      createdBy: 'محمد علي',
      type: 'PowerPoint'
    },
    {
      name: 'قالب تقويم المحتوى',
      category: 'التخطيط',
      createdDate: '2024-01-08',
      createdBy: 'فاطمة سالم',
      type: 'Excel'
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* شريط البحث والفلترة */}
      <BaseCard variant="operations" className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في النماذج والقوالب..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic"
            />
          </div>
          <UnifiedButton variant="outline" size="sm">
            فلترة
          </UnifiedButton>
          <UnifiedButton variant="primary" size="sm">
            <Plus className="h-4 w-4 ml-1" />
            إضافة قالب
          </UnifiedButton>
        </div>
      </BaseCard>

      {/* فئات النماذج */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6 text-black" />
          <h3 className="text-xl font-bold text-black font-arabic">فئات النماذج والقوالب</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templateCategories.map((category, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <category.icon className={`h-6 w-6 ${category.color}`} />
                <UnifiedBadge variant="default" size="sm">
                  {category.count}
                </UnifiedBadge>
              </div>
              <h4 className="font-medium font-arabic text-sm">{category.name}</h4>
            </div>
          ))}
        </div>
      </BaseCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* النماذج الأكثر استخداماً */}
        <BaseCard variant="operations" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-black" />
                <h3 className="text-xl font-bold text-black font-arabic">الأكثر استخداماً</h3>
              </div>
            <UnifiedButton variant="outline" size="sm">
              عرض الكل
            </UnifiedButton>
          </div>
          
          <div className="space-y-3">
            {popularTemplates.map((template, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <div>
                    <h4 className="font-medium font-arabic text-sm">{template.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="font-arabic">{template.category}</span>
                      <span>{template.downloads} تحميل</span>
                      <UnifiedBadge 
                        variant={template.status === 'محدث' ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {template.status}
                      </UnifiedBadge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <UnifiedButton size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </UnifiedButton>
                  <UnifiedButton size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </UnifiedButton>
                  <UnifiedButton size="sm" variant="outline">
                    <Copy className="h-4 w-4" />
                  </UnifiedButton>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>

        {/* النماذج الحديثة */}
        <BaseCard variant="operations" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-black" />
                <h3 className="text-xl font-bold text-black font-arabic">المضافة حديثاً</h3>
              </div>
            <UnifiedButton variant="outline" size="sm">
              عرض الكل
            </UnifiedButton>
          </div>
          
          <div className="space-y-3">
            {recentTemplates.map((template, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <div>
                    <h4 className="font-medium font-arabic text-sm">{template.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="font-arabic">{template.category}</span>
                      <span>{template.createdDate}</span>
                      <span className="font-arabic">{template.createdBy}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <UnifiedButton size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </UnifiedButton>
                  <UnifiedButton size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </UnifiedButton>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-black mb-1 font-arabic">41</h3>
          <p className="text-sm text-black font-arabic">إجمالي القوالب</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-black mb-1 font-arabic">312</h3>
          <p className="text-sm text-black font-arabic">إجمالي التحميلات</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-black mb-1 font-arabic">8</h3>
          <p className="text-sm text-black font-arabic">مضاف هذا الشهر</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-black mb-1 font-arabic">4.8</h3>
          <p className="text-sm text-black font-arabic">متوسط التقييم</p>
        </BaseCard>
      </div>
    </div>
  );
};
