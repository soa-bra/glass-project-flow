
import React from 'react';
import { CategoryRenderer } from './CategoryRenderer';

interface ArchiveCategoryPanelProps {
  selectedCategory: string;
}

export const ArchiveCategoryPanel: React.FC<ArchiveCategoryPanelProps> = ({ 
  selectedCategory 
}) => {
  return <CategoryRenderer selectedCategory={selectedCategory} />;
};
