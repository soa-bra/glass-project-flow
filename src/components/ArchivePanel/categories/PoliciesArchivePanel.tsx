import React from 'react';
import { GenericArchiveCategoryPanel } from './GenericArchiveCategoryPanel';
import { ARCHIVE_MOCK_DATA } from './archiveData';

export const PoliciesArchivePanel: React.FC = () => (
  <GenericArchiveCategoryPanel category="policies" records={ARCHIVE_MOCK_DATA.policies} />
);
