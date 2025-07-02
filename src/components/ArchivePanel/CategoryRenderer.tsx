
import React from 'react';
import { CategoryPanelFactory } from './CategoryPanelFactory';
import { CategoryRendererProps } from './CategoryPanelTypes';

export const CategoryRenderer: React.FC<CategoryRendererProps> = ({ selectedCategory }) => {
  return <CategoryPanelFactory category={selectedCategory} />;
};
