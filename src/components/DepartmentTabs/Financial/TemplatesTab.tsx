import React from 'react';
import { Upload, Download, FileText } from 'lucide-react';
import { BaseTabContent } from '@/components/shared/BaseTabContent';
import { BaseBox } from '@/components/ui/BaseBox';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { buildTitleClasses, COLORS, TYPOGRAPHY, SPACING } from '@/components/shared/design-system/constants';
import { Reveal, Stagger } from '@/components/shared/motion';
import { cn } from '@/lib/utils';

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
    <BaseTabContent value="templates">
      <Reveal>
        <div className={cn('flex justify-between items-center', SPACING.SECTION_MARGIN)}>
          <h3 className={buildTitleClasses()}>النماذج والقوالب المالية</h3>
          <BaseActionButton variant="primary" icon={<Upload className="w-4 h-4" />}>
            رفع قالب جديد
          </BaseActionButton>
        </div>
      </Reveal>

      <Stagger gap={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <Stagger.Item key={index}>
            <BaseBox className="cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className={cn(TYPOGRAPHY.BODY, 'font-semibold', COLORS.PRIMARY_TEXT, TYPOGRAPHY.ARABIC_FONT)}>
                    {template.name}
                  </h4>
                  <p className={cn(TYPOGRAPHY.SMALL, COLORS.SECONDARY_TEXT)}>
                    {template.type}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={cn(TYPOGRAPHY.SMALL, 'text-gray-400')}>
                  {template.downloads} تحميل
                </span>
                <BaseActionButton 
                  variant="primary" 
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                >
                  تحميل
                </BaseActionButton>
              </div>
            </BaseBox>
          </Stagger.Item>
        ))}
      </Stagger>
    </BaseTabContent>
  );
};
