import React from 'react';
import { GenericArchiveCategoryPanel } from './GenericArchiveCategoryPanel';
import { ARCHIVE_MOCK_DATA } from './archiveData';

export const OrganizationalArchivePanel: React.FC = () => (
  <GenericArchiveCategoryPanel category="organizational" records={ARCHIVE_MOCK_DATA.organizational} />
);
