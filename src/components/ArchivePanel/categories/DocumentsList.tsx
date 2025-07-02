
import React from 'react';
import { DocumentsListItem } from './DocumentsListItem';

interface Document {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
  author: string;
  department: string;
  version: string;
  classification: string;
  tags: string[];
}

interface DocumentsListProps {
  documents: Document[];
}

export const DocumentsList: React.FC<DocumentsListProps> = ({ documents }) => {
  return (
    <div className="flex-1 overflow-auto px-6 pb-6">
      <div className="space-y-4">
        {documents.map((document) => (
          <DocumentsListItem key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
};
