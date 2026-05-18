export type ArchiveCategoryKey =
  | 'documents'
  | 'projects'
  | 'hr'
  | 'financial'
  | 'legal'
  | 'organizational'
  | 'knowledge'
  | 'templates'
  | 'policies';

export interface ArchiveRecord {
  id: string;
  title: string;
  type: string;
  owner: string;
  status: string;
  date: string;
  description?: string;
}

export const ARCHIVE_CATEGORY_TITLES: Record<ArchiveCategoryKey, string> = {
  documents: 'الوثائق والمستندات',
  projects: 'المشاريع المكتملة',
  hr: 'أرشيف الموارد البشرية',
  financial: 'السجلات المالية',
  legal: 'الوثائق القانونية',
  organizational: 'الهيكل التنظيمي',
  knowledge: 'قاعدة المعرفة',
  templates: 'النماذج والقوالب',
  policies: 'السياسات والإجراءات',
};

export const ARCHIVE_MOCK_DATA: Record<Exclude<ArchiveCategoryKey, 'projects'>, ArchiveRecord[]> = {
  documents: [
    { id: 'd1', title: 'دليل الإجراءات التشغيلية', type: 'PDF', owner: 'إدارة الجودة', status: 'active', date: '2024-01-20' },
    { id: 'd2', title: 'سياسة الأمن والسلامة', type: 'DOCX', owner: 'الموارد البشرية', status: 'draft', date: '2024-01-18' },
  ],
  hr: [{ id: 'h1', title: 'ملف موظف - أحمد السعد', type: 'Employee Record', owner: 'HR', status: 'closed', date: '2023-12-31' }],
  financial: [{ id: 'f1', title: 'التقرير المالي السنوي', type: 'Annual Report', owner: 'Finance', status: 'approved', date: '2024-01-31' }],
  legal: [{ id: 'l1', title: 'عقد شراكة', type: 'Contract', owner: 'Legal', status: 'approved', date: '2024-01-15' }],
  organizational: [{ id: 'o1', title: 'هيكل إداري 2024', type: 'Org Chart', owner: 'PMO', status: 'active', date: '2024-01-10' }],
  knowledge: [{ id: 'k1', title: 'دروس مستفادة من المشاريع', type: 'Knowledge Note', owner: 'PMO', status: 'published', date: '2024-01-12' }],
  templates: [{ id: 't1', title: 'قالب تقرير شهري', type: 'Template', owner: 'PMO', status: 'published', date: '2024-01-20' }],
  policies: [{ id: 'p1', title: 'سياسة الأمن السيبراني', type: 'Policy', owner: 'IT Security', status: 'active', date: '2024-01-20' }],
};
