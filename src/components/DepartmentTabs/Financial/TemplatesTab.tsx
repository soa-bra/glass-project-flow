
import React from 'react';
import { Upload, Download, FileText } from 'lucide-react';
import { UnifiedSystemCard } from '@/components/ui/UnifiedSystemCard';
import { UnifiedSystemButton } from '@/components/ui/UnifiedSystemButton';

export const TemplatesTab: React.FC = () => {
  const templates = [
    { name: 'قالب الميزانية السنوية', type: 'Excel', downloads: 45 },
    { name: 'نموذج طلب صرف', type: 'PDF', downloads: 32 },
    { name: 'قالب الفاتورة الموحدة', type: 'Word', downloads: 78 },
    { name: 'نموذج تقرير مالي شهري', type: 'Excel', downloads: 23 },
    { name: 'قالب عقد مالي', type: 'PDF', downloads: 19 },
    { name: 'نموذج طلب ميزانية', type: 'Word', downloads: 56 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black font-arabic">النماذج والقوالب المالية</h3>
        <UnifiedSystemButton variant="primary" icon={<Upload />}>
          رفع قالب جديد
        </UnifiedSystemButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <UnifiedSystemCard key={index} size="md" className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-black" />
              <div>
                <h4 className="text-sm font-bold text-black font-arabic">{template.name}</h4>
                <p className="text-sm font-normal text-black">{template.type}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-normal text-gray-400">{template.downloads} تحميل</span>
              <UnifiedSystemButton variant="primary" size="sm" icon={<Download />}>
                تحميل
              </UnifiedSystemButton>
            </div>
          </UnifiedSystemCard>
        ))}
      </div>
    </div>
  );
};
