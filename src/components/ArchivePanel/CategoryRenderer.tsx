
import React from 'react';
import { CategoryPanelFactory } from './CategoryPanelFactory';
import { CategoryRendererProps } from './CategoryPanelTypes';

export const CategoryRenderer: React.FC<CategoryRendererProps> = ({ selectedCategory }) => {
  const normalizedCategory = selectedCategory.trim().toLowerCase();
  return <CategoryPanelFactory category={normalizedCategory} />;
};
