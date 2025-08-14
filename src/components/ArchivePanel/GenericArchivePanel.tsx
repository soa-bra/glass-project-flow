
import React from 'react';
import { SoaCard } from '@/components/ui/SoaCard';
import { SoaTypography } from '@/components/ui/SoaTypography';
import { SoaMotion } from '@/components/ui/SoaMotion';

interface GenericArchivePanelProps {
  category: string;
}

export const GenericArchivePanel: React.FC<GenericArchivePanelProps> = ({ category }) => {
  const getCategoryTitle = (category: string) => {
    const titles: { [key: string]: string } = {
      'organizational': 'الهيكل التنظيمي',
      'knowledge': 'قاعدة المعرفة',
      'templates': 'النماذج والقوالب',
      'policies': 'السياسات والإجراءات'
    };
    return titles[category] || 'الأرشيف';
  };

  return (
    <SoaCard variant="sub" className="h-full flex items-center justify-center">
      <SoaMotion variant="scale" delay={0.3}>
        <div className="text-center">
          <SoaTypography variant="display-m" className="text-soabra-ink-60 mb-4">
            {getCategoryTitle(category)}
          </SoaTypography>
          <SoaTypography variant="body" className="text-soabra-ink-30">
            هذا القسم قيد التطوير وسيتم إضافة المحتوى قريباً
          </SoaTypography>
        </div>
      </SoaMotion>
    </SoaCard>
  );
};
