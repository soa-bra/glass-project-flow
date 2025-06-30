
import React from 'react';
import { FileTemplate, Download, Plus, Star, Search, Filter } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TemplatesTabProps {
  departmentTitle: string;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({ departmentTitle }) => {
  const templateCategories = [
    {
      name: 'النماذج الإدارية',
      count: 12,
      icon: FileTemplate,
      color: 'text-blue-600'
    },
    {
      name: 'قوالب التقارير',
      count: 8,
      icon: FileTemplate,
      color: 'text-green-600'
    },
    {
      name: 'النماذج المالية',
      count: 15,
      icon: FileTemplate,
      color: 'text-purple-600'
    },
    {
      name: 'قوالب المراسلات',
      count: 6,
      icon: FileTemplate,
      color: 'text-orange-600'
    }
  ];

  const popularTemplates = [
    {
      name: 'نموذج طلب إجازة',
      category: 'إداري',
      downloads: 1240,
      rating: 4.8,
      size: '245 KB',
      type: 'Word'
    },
    {
      name: 'قالب التقرير الشهري',
      category: 'تقارير',
      downloads: 890,
      rating: 4.6,
      size: '180 KB',
      type: 'Excel'
    },
    {
      name: 'نموذج الميزانية السنوية',
      category: 'مالي',
      downloads: 670,
      rating: 4.9,
      size: '320 KB',
      type: 'Excel'
    },
    {
      name: 'قالب المراسلة الرسمية',
      category: 'مراسلات',
      downloads: 450,
      rating: 4.5,
      size: '120 KB',
      type: 'Word'
    }
  ];

  const recentTemplates = [
    {
      name: 'نموذج تقييم الأداء الجديد',
      category: 'موارد بشرية',
      addedDate: '2024-12-28',
      isNew: true
    },
    {
      name: 'قالب عرض المشروع',
      category: 'مشاريع',
      addedDate: '2024-12-25',
      isNew: true
    },
    {
      name: 'نموذج طلب الشراء المحدث',
      category: 'مالي',
      addedDate: '2024-12-22',
      isNew: false
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* شريط البحث والفلترة */}
      <BaseCard variant="operations" className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="البحث في النماذج والقوالب..." 
              className="pr-10 font-arabic"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 ml-2" />
            فلترة
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 ml-2" />
            إضافة نموذج
          </Button>
        </div>
      </BaseCard>

      {/* فئات النماذج */}
      <BaseCard variant="operations" className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 font-arabic">فئات النماذج والقوالب</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templateCategories.map((category, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <category.icon className={`h-6 w-6 ${category.color}`} />
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </div>
              <h4 className="font-medium font-arabic text-sm">{category.name}</h4>
            </div>
          ))}
        </div>
      </BaseCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* النماذج الأكثر استخداماً */}
        <BaseCard variant="operations" className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">الأكثر استخداماً</h3>
          </div>
          
          <div className="space-y-4">
            {popularTemplates.map((template, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium font-arabic text-sm">{template.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <Badge variant="outline" className="text-xs">{template.category}</Badge>
                      <span>{template.downloads} تحميل</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{template.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{template.size}</span>
                  <Badge variant="outline" className="text-xs">{template.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>

        {/* النماذج الحديثة */}
        <BaseCard variant="operations" className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="h-5 w-5 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">المضافة حديثاً</h3>
          </div>
          
          <div className="space-y-4">
            {recentTemplates.map((template, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium font-arabic text-sm">{template.name}</h4>
                      {template.isNew && (
                        <Badge variant="default" className="text-xs">جديد</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <Badge variant="outline" className="text-xs">{template.category}</Badge>
                      <span>أُضيف في {template.addedDate}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4" size="sm">
            عرض المزيد
          </Button>
        </BaseCard>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-blue-600 mb-1 font-arabic">42</h3>
          <p className="text-sm text-gray-600 font-arabic">إجمالي النماذج</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-green-600 mb-1 font-arabic">1,890</h3>
          <p className="text-sm text-gray-600 font-arabic">مرات التحميل</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-purple-600 mb-1 font-arabic">8</h3>
          <p className="text-sm text-gray-600 font-arabic">نماذج جديدة</p>
        </BaseCard>

        <BaseCard variant="operations" size="sm" className="text-center">
          <h3 className="text-2xl font-bold text-orange-600 mb-1 font-arabic">4.7</h3>
          <p className="text-sm text-gray-600 font-arabic">متوسط التقييم</p>
        </BaseCard>
      </div>
    </div>
  );
};
