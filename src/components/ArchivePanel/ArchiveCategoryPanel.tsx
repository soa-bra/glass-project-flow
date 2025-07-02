
import React from 'react';
import { 
  DocumentsArchivePanel,
  ProjectsArchivePanel,
  HRArchivePanel,
  FinancialArchivePanel,
  LegalArchivePanel
} from './categories';

interface ArchiveCategoryPanelProps {
  selectedCategory: string;
}

export const ArchiveCategoryPanel: React.FC<ArchiveCategoryPanelProps> = ({ 
  selectedCategory 
}) => {
  const renderCategoryPanel = () => {
    switch (selectedCategory) {
      case 'documents':
        return <DocumentsArchivePanel />;
      case 'projects':
        return <ProjectsArchivePanel />;
      case 'hr':
        return <HRArchivePanel />;
      case 'financial':
        return <FinancialArchivePanel />;
      case 'legal':
        return <LegalArchivePanel />;
      case 'organizational':
      case 'knowledge':
      case 'templates':
      case 'policies':
        return <GenericArchivePanel category={selectedCategory} />;
      default:
        return <GenericArchivePanel category={selectedCategory} />;
    }
  };

  return renderCategoryPanel();
};

// Generic panel for categories that don't have specialized components yet
const GenericArchivePanel: React.FC<{ category: string }> = ({ category }) => {
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
