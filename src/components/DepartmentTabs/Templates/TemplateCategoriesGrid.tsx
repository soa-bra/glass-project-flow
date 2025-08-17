
import React from 'react';
import { FileText } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';
import { BaseBadge } from '@/components/ui/BaseBadge';

interface TemplateCategory {
  name: string;
  count: number;
  icon: typeof FileText;
  color: string;
}

export const TemplateCategoriesGrid: React.FC = () => {
  const templateCategories: TemplateCategory[] = [
    {
      name: 'النماذج الإدارية',
      count: 12,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      name: 'قوالب التقارير',
      count: 8,
      icon: FileText,
      color: 'text-green-600'
    },
    {
      name: 'النماذج المالية',
      count: 15,
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      name: 'قوالب المراسلات',
      count: 6,
      icon: FileText,
      color: 'text-orange-600'
    }
  ];

  return (
    <BaseCard variant="operations" className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 font-arabic">فئات النماذج والقوالب</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templateCategories.map((category, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <category.icon className={`h-6 w-6 ${category.color}`} />
              <BaseBadge variant="secondary" className="text-xs">
                {category.count}
              </BaseBadge>
            </div>
            <h4 className="font-medium font-arabic text-sm">{category.name}</h4>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
