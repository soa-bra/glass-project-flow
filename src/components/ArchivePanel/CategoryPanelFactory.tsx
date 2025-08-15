
import React from 'react';
import { 
  DocumentsArchivePanel,
  ProjectsArchivePanel,
  HRArchivePanel,
  FinancialArchivePanel,
  LegalArchivePanel,
  OrganizationalArchivePanel,
  KnowledgeArchivePanel,
  TemplatesArchivePanel,
  PoliciesArchivePanel
} from './categories';
import { BaseArchivePanel } from './BaseArchivePanel';
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
      case 'organizational':
        return <OrganizationalArchivePanel />;
      case 'knowledge':
        return <KnowledgeArchivePanel />;
      case 'templates':
        return <TemplatesArchivePanel />;
      case 'policies':
        return <PoliciesArchivePanel />;
      default:
        return null;
    }
  };

  const isSpecializedCategory = (cat: string): cat is ArchiveCategoryType => {
    return ['documents', 'projects', 'hr', 'financial', 'legal', 'organizational', 'knowledge', 'templates', 'policies'].includes(cat);
  };

  if (isSpecializedCategory(category)) {
    return renderSpecializedPanel(category);
  }

  // Fallback for unknown categories
  return <BaseArchivePanel category={category} />;
};
