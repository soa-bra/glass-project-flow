/**
 * DocumentsArchivePanel — wired to public.archive_documents (category='documents').
 * Falls back to a curated demo list while the table is empty so the panel
 * never looks broken for a fresh tenant.
 *
 * @specRef ArchiveWorkspace.documents
 */
import React, { useMemo, useState } from 'react';
import { DocumentsArchiveHeader } from './DocumentsArchiveHeader';
import { DocumentsSearchBar } from './DocumentsSearchBar';
import { DocumentsList } from './DocumentsList';
import { COLORS } from '@/components/shared/design-system/constants';
import { useArchiveDocuments } from '@/hooks/archive/useArchiveDocuments';

const FALLBACK_DOCUMENTS = [
  {
    id: 'demo-1',
    title: 'دليل الإجراءات التشغيلية الموحد',
    type: 'PDF',
    size: '3.2 MB',
    date: '2024-01-20',
    author: 'إدارة الجودة',
    department: 'الجودة والتطوير',
    version: 'v2.1',
    classification: 'محدود',
    tags: ['إجراءات', 'تشغيل', 'جودة'],
  },
  {
    id: 'demo-2',
    title: 'سياسة الأمن والسلامة المهنية',
    type: 'DOCX',
    size: '1.8 MB',
    date: '2024-01-18',
    author: 'قسم السلامة',
    department: 'الموارد البشرية',
    version: 'v1.5',
    classification: 'عام',
    tags: ['أمن', 'سلامة', 'سياسة'],
  },
];

export const DocumentsArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: rows = [], isLoading } = useArchiveDocuments('documents');

  const documents = useMemo(() => {
    const liveDocs = rows.map((r) => {
      const meta = (r.metadata ?? {}) as Record<string, unknown>;
      return {
        id: r.id,
        title: r.title,
        type: String(meta.type ?? 'PDF'),
        size: String(meta.size ?? '—'),
        date: r.updated_at?.slice(0, 10) ?? '',
        author: String(meta.author ?? '—'),
        department: String(meta.department ?? '—'),
        version: r.version ?? 'v1',
        classification: String(meta.classification ?? 'عام'),
        tags: r.tags ?? [],
      };
    });
    const source = liveDocs.length > 0 ? liveDocs : FALLBACK_DOCUMENTS;
    if (!searchQuery.trim()) return source;
    const q = searchQuery.toLowerCase();
    return source.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [rows, searchQuery]);

  return (
    <div className={`h-full flex flex-col ${COLORS.TRANSPARENT_BACKGROUND}`}>
      <DocumentsArchiveHeader />
      <DocumentsSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      {isLoading ? (
        <div className="px-6 py-4 text-sm text-muted-foreground">…جارٍ التحميل</div>
      ) : (
        <DocumentsList documents={documents} />
      )}
    </div>
  );
};
