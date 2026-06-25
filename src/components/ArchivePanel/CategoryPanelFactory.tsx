/**
 * CategoryPanelFactory — selects an archive category renderer.
 *
 * Routing policy (mirrors FeatureDepartmentPanel):
 *  - Default: legacy specialized panel for each spec archive category.
 *  - `?spec=1` query param forces rendering through SpecDrivenDashboard
 *    (entire ArchiveWorkspace spec) for QA.
 *
 * @specRef Section 7 (Archive Workspace)
 */
import React from 'react';
import {
  DocumentsArchivePanel,
  ProjectsArchivePanel,
  TasksArchivePanel,
  HRArchivePanel,
  FinancialArchivePanel,
  LegalArchivePanel,
  OrganizationalArchivePanel,
  KnowledgeArchivePanel,
  TemplatesArchivePanel,
  PoliciesArchivePanel,
} from './categories';
import { BaseArchivePanel } from './BaseArchivePanel';
import { ArchiveCategoryType } from './CategoryPanelTypes';
import { SpecDrivenDashboard } from '@/components/spec-driven/SpecDrivenDashboard';

interface CategoryPanelFactoryProps {
  category: string;
}

const SPECIALIZED: Record<ArchiveCategoryType, React.ComponentType> = {
  documents: DocumentsArchivePanel,
  projects: ProjectsArchivePanel,
  tasks: TasksArchivePanel,
  hr: HRArchivePanel,
  financial: FinancialArchivePanel,
  legal: LegalArchivePanel,
  organizational: OrganizationalArchivePanel,
  knowledge: KnowledgeArchivePanel,
  templates: TemplatesArchivePanel,
  policies: PoliciesArchivePanel,
};

const isSpecialized = (cat: string): cat is ArchiveCategoryType =>
  cat in SPECIALIZED;

export const CategoryPanelFactory: React.FC<CategoryPanelFactoryProps> = ({ category }) => {
  const forceSpec =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('spec') === '1';

  if (forceSpec) return <SpecDrivenDashboard dashboardKey="archive" />;

  if (isSpecialized(category)) {
    const Panel = SPECIALIZED[category];
    return <Panel />;
  }

  return <BaseArchivePanel category={category} />;
};
