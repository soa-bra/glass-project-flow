import React from 'react';
import { GenericArchiveCategoryPanel } from './GenericArchiveCategoryPanel';
import type { ArchiveCategoryKey } from './archiveData';
import { useArchiveCategoryRecords } from './useArchiveCategoryRecords';

const createArchiveCategoryPanel = (category: ArchiveCategoryKey): React.FC => {
  const CategoryPanel: React.FC = () => {
    const { records, isLoading, isError } = useArchiveCategoryRecords(category);
    return <GenericArchiveCategoryPanel category={category} records={records} isLoading={isLoading} isError={isError} />;
  };

  CategoryPanel.displayName = `${category}ArchivePanel`;
  return CategoryPanel;
};

export const DocumentsArchivePanel = createArchiveCategoryPanel('documents');
export const ProjectsArchivePanel = createArchiveCategoryPanel('projects');
export const HRArchivePanel = createArchiveCategoryPanel('hr');
export const FinancialArchivePanel = createArchiveCategoryPanel('financial');
export const LegalArchivePanel = createArchiveCategoryPanel('legal');
export const OrganizationalArchivePanel = createArchiveCategoryPanel('organizational');
export const KnowledgeArchivePanel = createArchiveCategoryPanel('knowledge');
export const TemplatesArchivePanel = createArchiveCategoryPanel('templates');
export const PoliciesArchivePanel = createArchiveCategoryPanel('policies');
