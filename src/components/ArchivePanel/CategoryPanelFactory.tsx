
import React from 'react';
import { 
  DocumentsArchivePanel,
  ProjectsArchivePanel,
  HRArchivePanel,
  FinancialArchivePanel,
  LegalArchivePanel
} from './categories';
import { GenericArchivePanel } from './GenericArchivePanel';
import { ArchiveCategoryType } from './CategoryPanelTypes';

interface CategoryPanelFactoryProps {
  category: string;
}

export const CategoryPanelFactory: React.FC<CategoryPanelFactoryProps> = ({ category }) => {
  const renderSpecializedPanel = (categoryType: ArchiveCategoryType) => {
    switch (categoryType) {
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
      default:
        return null;
    }
  };

  const isSpecializedCategory = (cat: string): cat is ArchiveCategoryType => {
    return ['documents', 'projects', 'hr', 'financial', 'legal'].includes(cat);
  };

  const isGenericCategory = (cat: string): cat is ArchiveCategoryType => {
    return ['organizational', 'knowledge', 'templates', 'policies'].includes(cat);
  };

  if (isSpecializedCategory(category)) {
    return renderSpecializedPanel(category);
  }

  if (isGenericCategory(category)) {
    return <GenericArchivePanel category={category} />;
  }

  // Fallback for unknown categories
  return <GenericArchivePanel category={category} />;
};
