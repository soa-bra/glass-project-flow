
import React from 'react';

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
    <div className="h-full flex items-center justify-center bg-transparent">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-600 mb-4 font-arabic">
          {getCategoryTitle(category)}
        </h2>
        <p className="text-gray-500 font-arabic">
          هذا القسم قيد التطوير وسيتم إضافة المحتوى قريباً
        </p>
      </div>
    </div>
  );
};
