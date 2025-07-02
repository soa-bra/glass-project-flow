
import React from 'react';
import { 
  DocumentsArchivePanel,
  ProjectsArchivePanel,
  HRArchivePanel,
  FinancialArchivePanel,
  LegalArchivePanel
} from './categories';
import { GenericArchivePanel } from './GenericArchivePanel';

interface CategoryRendererProps {
  selectedCategory: string;
}

export const CategoryRenderer: React.FC<CategoryRendererProps> = ({ selectedCategory }) => {
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
