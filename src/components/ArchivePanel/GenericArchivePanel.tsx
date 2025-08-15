
import React from 'react';
import { COLORS, LAYOUT, TYPOGRAPHY } from '@/components/shared/design-system/constants';

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
    <div className={`h-full ${LAYOUT.FLEX_CENTER} ${COLORS.TRANSPARENT_BACKGROUND}`}>
      <div className="text-center">
        <h2 className={`${TYPOGRAPHY.LARGE_TITLE_SIZE} text-gray-600 mb-4 ${TYPOGRAPHY.ARABIC_FONT}`}>
          {getCategoryTitle(category)}
        </h2>
        <p className={`text-gray-500 ${TYPOGRAPHY.ARABIC_FONT}`}>
          هذا القسم قيد التطوير وسيتم إضافة المحتوى قريباً
        </p>
      </div>
    </div>
  );
};
