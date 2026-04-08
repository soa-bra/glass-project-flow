import React, { useState } from "react";
import React from 'react';
import { Upload, Download, FileText } from 'lucide-react';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { SPACING } from '@/components/shared/design-system/constants';
import { Reveal, Stagger } from '@/components/shared/motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const TemplatesTab: React.FC = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const templates = [
    { name: 'قالب الميزانية السنوية', type: 'Excel', downloads: 45 },
    { name: 'نموذج طلب صرف', type: 'PDF', downloads: 32 },
    { name: 'قالب الفاتورة الموحدة', type: 'Word', downloads: 78 },
    { name: 'نموذج تقرير مالي شهري', type: 'Excel', downloads: 23 },
    { name: 'قالب عقد مالي', type: 'PDF', downloads: 19 },
    { name: 'نموذج طلب ميزانية', type: 'Word', downloads: 56 },
  ];

  const handleUpload = () => {
    setIsUploadOpen(true);
  };

  const handleDownload = (template: typeof templates[0]) => {
    const blob = new Blob([JSON.stringify({ name: template.name, type: template.type, content: 'محتوى القالب' }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`تم تحميل: ${template.name}`);
  };

  return (
    <BaseTabContent value="templates">
      <Reveal>
        <div className={cn('flex justify-between items-center', SPACING.SECTION_MARGIN)}>
          <h3 className="text-lg font-bold text-[#0B0F12] font-arabic">النماذج والقوالب المالية</h3>
          <BaseActionButton variant="primary" icon={<Upload className="w-4 h-4" />} onClick={handleUpload}>
            رفع قالب جديد
          </BaseActionButton>
        </div>
      </Reveal>

      <Stagger gap={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((template, index) => (
          <Stagger.Item key={index}>
            <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6 flex flex-col justify-between min-h-[160px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow cursor-pointer">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-[rgba(11,15,18,0.40)]" />
                  <span className="text-xs font-medium text-[rgba(11,15,18,0.50)] font-arabic">{template.type}</span>
                </div>
                <h4 className="text-base font-bold text-[#0B0F12] font-arabic leading-snug">
                  {template.name}
                </h4>
              </div>
              <div className="flex justify-between items-center mt-auto pt-4">
                <span className="text-[11px] text-[rgba(11,15,18,0.35)] font-arabic">
                  {template.downloads} تحميل
                </span>
                <button
                  onClick={() => handleDownload(template)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B0F12] text-white text-xs font-medium hover:bg-[#0B0F12]/90 transition-colors font-arabic"
                >
                  <Download className="w-3.5 h-3.5" /> تحميل
                </button>
              </div>
            </div>
          </Stagger.Item>
        ))}
      </Stagger>
    </BaseTabContent>
  );
};
