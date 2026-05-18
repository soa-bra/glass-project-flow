import { render, screen } from '@testing-library/react';
import {
  DocumentsArchivePanel,
  FinancialArchivePanel,
  HRArchivePanel,
  KnowledgeArchivePanel,
  LegalArchivePanel,
  OrganizationalArchivePanel,
  PoliciesArchivePanel,
  ProjectsArchivePanel,
  TemplatesArchivePanel,
} from './archiveCategoryPanels';

vi.mock('@/hooks/central', () => ({
  useProjects: () => ({ data: [], isLoading: false, error: null }),
}));

const CASES = [
  { key: 'documents', Panel: DocumentsArchivePanel },
  { key: 'projects', Panel: ProjectsArchivePanel },
  { key: 'hr', Panel: HRArchivePanel },
  { key: 'financial', Panel: FinancialArchivePanel },
  { key: 'legal', Panel: LegalArchivePanel },
  { key: 'organizational', Panel: OrganizationalArchivePanel },
  { key: 'knowledge', Panel: KnowledgeArchivePanel },
  { key: 'templates', Panel: TemplatesArchivePanel },
  { key: 'policies', Panel: PoliciesArchivePanel },
] as const;

describe('Archive category acceptance boxes', () => {
  it.each(CASES)('renders header-actions, search, records-list for $key', ({ key, Panel }) => {
    render(<Panel />);

    expect(screen.getByTestId(`${key}-header-actions`)).toBeInTheDocument();
    expect(screen.getByTestId(`${key}-search`)).toBeInTheDocument();
    expect(screen.getByTestId(`${key}-records-list`)).toBeInTheDocument();
  });
});
