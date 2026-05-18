import React from 'react';
import { GenericArchiveCategoryPanel } from './GenericArchiveCategoryPanel';
import { ARCHIVE_MOCK_DATA } from './archiveData';

export const HRArchivePanel: React.FC = () => (
  <GenericArchiveCategoryPanel category="hr" records={ARCHIVE_MOCK_DATA.hr} />
);
