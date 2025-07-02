
import React from 'react';
import { Download, Eye, FileText, Calendar, User, Shield, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

interface DocumentsListItemProps {
  document: Document;
}

export const DocumentsListItem: React.FC<DocumentsListItemProps> = ({ document }) => {
  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'سري': return 'bg-red-100 text-red-800 border-red-200';
      case 'محدود': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'عام': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-bold text-black font-arabic text-lg">{document.title}</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getClassificationColor(document.classification)}`}>
              <Shield className="w-3 h-3 inline mr-1" />
              {document.classification}
            </div>
            <Badge variant="secondary" className="font-arabic">
              {document.version}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {document.type} • {document.size}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {document.date}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {document.author}
            </span>
            <span className="flex items-center gap-1 font-arabic">
              {document.department}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            {document.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="font-arabic">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <Button size="sm" className="bg-black text-white rounded-full">
            <Eye className="w-4 h-4 mr-1" />
            عرض
          </Button>
          <Button size="sm" variant="outline" className="rounded-full">
            <Download className="w-4 h-4 mr-1" />
            تحميل
          </Button>
        </div>
      </div>
    </div>
  );
};
