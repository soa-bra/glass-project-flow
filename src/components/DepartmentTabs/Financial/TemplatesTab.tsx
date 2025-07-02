
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileText } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';

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
        <h3 className="text-lg font-semibold text-black font-arabic">النماذج والقوالب المالية</h3>
        <Button className="bg-transparent border border-black/20 text-black hover:bg-black/5 rounded-full">
          <Upload className="w-4 h-4 mr-2" />
          رفع قالب جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <div key={index} className="bg-[#f2ffff] rounded-3xl p-6 border border-transparent cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-black" />
                <div>
                  <h4 className="text-sm font-bold text-black font-arabic">{template.name}</h4>
                  <p className="text-sm font-medium text-black font-arabic">{template.type}</p>
                </div>
              </div>
              <CircularIconButton 
                icon={Download}
                size="sm"
                className="w-8 h-8 bg-transparent border border-black/20 text-black"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-normal text-gray-400 font-arabic">{template.downloads} تحميل</span>
              <Button 
                size="sm" 
                className="bg-transparent border border-black/20 text-black hover:bg-black/5 rounded-full text-xs"
              >
                <Download className="w-4 h-4 mr-2" />
                تحميل
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
