
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileText } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';

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
        <h3 className="text-2xl font-bold">النماذج والقوالب المالية</h3>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          رفع قالب جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <BaseCard key={index} variant="operations" className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-semibold">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.type}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{template.downloads} تحميل</span>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                تحميل
              </Button>
            </div>
          </BaseCard>
        ))}
      </div>
    </div>
  );
};
