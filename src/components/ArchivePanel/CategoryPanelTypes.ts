export type ArchiveCategoryType = 
  | 'documents'
  | 'projects'
  | 'tasks'
  | 'hr'
  | 'financial'
  | 'legal'
  | 'organizational'
  | 'knowledge'
  | 'templates'
  | 'policies';

export interface CategoryPanelProps {
  selectedCategory: string;
}

export interface CategoryRendererProps {
  selectedCategory: string;
}
