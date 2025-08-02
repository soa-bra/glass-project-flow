
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
        <h3 className="text-large font-semibold text-black font-arabic">النماذج والقوالب المالية</h3>
        <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
          <Upload className="w-4 h-4" />
          رفع قالب جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <div key={index} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-black" />
              <div>
                <h4 className="text-sm font-bold text-black font-arabic">{template.name}</h4>
                <p className="text-sm font-normal text-black">{template.type}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-normal text-gray-400">{template.downloads} تحميل</span>
              <button className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                تحميل
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
