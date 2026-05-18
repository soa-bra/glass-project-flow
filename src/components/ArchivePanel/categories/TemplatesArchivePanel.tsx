import React from 'react';
import { GenericArchiveCategoryPanel } from './GenericArchiveCategoryPanel';
import { ARCHIVE_MOCK_DATA } from './archiveData';

export const TemplatesArchivePanel: React.FC = () => (
  <GenericArchiveCategoryPanel category="templates" records={ARCHIVE_MOCK_DATA.templates} />
);
