
import React from 'react';
import { 
  DocumentsArchivePanel,
  ProjectsArchivePanel,
  HRArchivePanel,
  FinancialArchivePanel,
  LegalArchivePanel,
  OrganizationalArchivePanel,
  KnowledgeArchivePanel,
  TemplatesArchivePanel,
  PoliciesArchivePanel
} from './categories';
import { BaseArchivePanel } from './BaseArchivePanel';
import { ArchiveCategoryType } from './CategoryPanelTypes';

interface CategoryPanelFactoryProps {
  category: string;
}

const ARCHIVE_CATEGORY_COMPONENTS: Record<ArchiveCategoryType, React.FC> = {
  documents: DocumentsArchivePanel,
  projects: ProjectsArchivePanel,
  hr: HRArchivePanel,
  financial: FinancialArchivePanel,
  legal: LegalArchivePanel,
  organizational: OrganizationalArchivePanel,
  knowledge: KnowledgeArchivePanel,
  templates: TemplatesArchivePanel,
  policies: PoliciesArchivePanel
};

const KNOWN_ARCHIVE_CATEGORIES = Object.keys(ARCHIVE_CATEGORY_COMPONENTS) as ArchiveCategoryType[];

const UnknownArchiveCategoryFallback: React.FC<{ category: string }> = ({ category }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center rounded-xl border border-amber-300 bg-amber-50 p-6 text-center">
      <p className="text-sm font-semibold text-amber-900">تعذّر تحميل تصنيف الأرشيف</p>
      <p className="mt-2 text-xs text-amber-800">القيمة المستلمة: {category || 'غير معروفة'}</p>
      <p className="mt-2 text-xs text-amber-700">التصنيفات المدعومة: {KNOWN_ARCHIVE_CATEGORIES.join('، ')}</p>
    </div>
  );
};

export const CategoryPanelFactory: React.FC<CategoryPanelFactoryProps> = ({ category }) => {
  const isSpecializedCategory = (cat: string): cat is ArchiveCategoryType => {
    return KNOWN_ARCHIVE_CATEGORIES.includes(cat as ArchiveCategoryType);
  };

  if (isSpecializedCategory(category)) {
    const PanelComponent = ARCHIVE_CATEGORY_COMPONENTS[category];
    return <PanelComponent />;
  }

  return (
    <div className="space-y-4">
      <UnknownArchiveCategoryFallback category={category} />
      <BaseArchivePanel category={category} />
    </div>
  );
};
