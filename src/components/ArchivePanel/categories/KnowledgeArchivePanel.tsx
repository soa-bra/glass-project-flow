import React from 'react';
import { GenericArchiveCategoryPanel } from './GenericArchiveCategoryPanel';
import { ARCHIVE_MOCK_DATA } from './archiveData';

export const KnowledgeArchivePanel: React.FC = () => (
  <GenericArchiveCategoryPanel category="knowledge" records={ARCHIVE_MOCK_DATA.knowledge} />
);
