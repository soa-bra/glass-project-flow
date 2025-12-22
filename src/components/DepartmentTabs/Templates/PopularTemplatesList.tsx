
import React from 'react';
import { Star, Download } from 'lucide-react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';

interface PopularTemplate {
  name: string;
  category: string;
  downloads: number;
  rating: number;
  size: string;
  type: string;
}

export const PopularTemplatesList: React.FC = () => {
  const popularTemplates: PopularTemplate[] = [
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

  return (
    <BaseBox variant="operations" className="p-6">
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
                  <BaseBadge variant="outline" className="text-xs">{template.category}</BaseBadge>
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
              <BaseBadge variant="outline" className="text-xs">{template.type}</BaseBadge>
            </div>
          </div>
        ))}
      </div>
    </BaseBox>
  );
};
