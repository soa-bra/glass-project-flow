import React from 'react';
import { GenericArchiveCategoryPanel } from './GenericArchiveCategoryPanel';
import { ARCHIVE_MOCK_DATA } from './archiveData';

export const DocumentsArchivePanel: React.FC = () => (
  <GenericArchiveCategoryPanel category="documents" records={ARCHIVE_MOCK_DATA.documents} />
);
