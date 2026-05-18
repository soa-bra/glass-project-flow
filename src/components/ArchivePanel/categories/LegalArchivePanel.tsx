import React from 'react';
import { GenericArchiveCategoryPanel } from './GenericArchiveCategoryPanel';
import { ARCHIVE_MOCK_DATA } from './archiveData';

export const LegalArchivePanel: React.FC = () => (
  <GenericArchiveCategoryPanel category="legal" records={ARCHIVE_MOCK_DATA.legal} />
);
