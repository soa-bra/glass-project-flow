
import React from 'react';
import { DocumentsArchive } from '../ArchiveTabs/DocumentsArchive';
import { ProjectsArchive } from '../ArchiveTabs/ProjectsArchive';
import { MediaArchive } from '../ArchiveTabs/MediaArchive';
import { FinancialArchive } from '../ArchiveTabs/FinancialArchive';
import { ContractsArchive } from '../ArchiveTabs/ContractsArchive';

interface SpecializedArchivePanelProps {
  selectedCategory: string;
}

export const SpecializedArchivePanel: React.FC<SpecializedArchivePanelProps> = ({ 
  selectedCategory 
}) => {
  const renderArchiveCategory = () => {
    switch (selectedCategory) {
      case 'documents':
        return <DocumentsArchive />;
      case 'projects':
        return <ProjectsArchive />;
      case 'media':
        return <MediaArchive />;
      case 'financial':
        return <FinancialArchive />;
      case 'contracts':
        return <ContractsArchive />;
      default:
        return null;
    }
  };

  return renderArchiveCategory();
};
