
import React from 'react';
import { Plus, Download } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';

interface RecentTemplate {
  name: string;
  category: string;
  addedDate: string;
  isNew: boolean;
}

export const RecentTemplatesList: React.FC = () => {
  const recentTemplates: RecentTemplate[] = [
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
                    <BaseBadge variant="success" className="text-xs">جديد</BaseBadge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <BaseBadge variant="outline" className="text-xs">{template.category}</BaseBadge>
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
  );
};
