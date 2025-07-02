
import React, { useState } from 'react';
import { DocumentsArchiveHeader } from './DocumentsArchiveHeader';
import { DocumentsSearchBar } from './DocumentsSearchBar';
import { DocumentsList } from './DocumentsList';

export const DocumentsArchivePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockDocuments = [
    {
      id: '1',
      title: 'دليل الإجراءات التشغيلية الموحد',
      type: 'PDF',
      size: '3.2 MB',
      date: '2024-01-20',
      author: 'إدارة الجودة',
      department: 'الجودة والتطوير',
      version: 'v2.1',
      classification: 'محدود',
      tags: ['إجراءات', 'تشغيل', 'جودة']
    },
    {
      id: '2',
      title: 'سياسة الأمن والسلامة المهنية',
      type: 'DOCX',
      size: '1.8 MB',
      date: '2024-01-18',
      author: 'قسم السلامة',
      department: 'الموارد البشرية',
      version: 'v1.5',
      classification: 'عام',
      tags: ['أمن', 'سلامة', 'سياسة']
    },
    {
      id: '3',
      title: 'دليل الهوية البصرية للعلامة التجارية',
      type: 'PDF',
      size: '15.6 MB',
      date: '2024-01-15',
      author: 'فريق التصميم',
      department: 'العلامة التجارية',
      version: 'v3.0',
      classification: 'سري',
      tags: ['هوية بصرية', 'تصميم', 'علامة تجارية']
    }
  ];

  return (
    <div className="h-full flex flex-col bg-transparent">
      <DocumentsArchiveHeader />
      <DocumentsSearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <DocumentsList documents={mockDocuments} />
    </div>
  );
};
