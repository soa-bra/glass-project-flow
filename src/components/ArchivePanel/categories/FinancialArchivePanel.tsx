import React from 'react';
import { GenericArchiveCategoryPanel } from './GenericArchiveCategoryPanel';
import { ARCHIVE_MOCK_DATA } from './archiveData';

export const FinancialArchivePanel: React.FC = () => (
  <GenericArchiveCategoryPanel category="financial" records={ARCHIVE_MOCK_DATA.financial} />
);
