
import React, { useState } from 'react';
import { Search, Filter, Download, Eye, FileText, Calendar, User, Shield, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'سري': return 'bg-red-100 text-red-800 border-red-200';
      case 'محدود': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'عام': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="font-medium text-black font-arabic text-3xl">
          الوثائق والمستندات
        </h2>
        <div className="flex items-center gap-3">
          <Button className="bg-black text-white rounded-full">
            <Download className="w-4 h-4 mr-2" />
            تصدير شامل
          </Button>
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            تصفية متقدمة
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mb-6">
        <div className="bg-[#f2ffff] p-4 rounded-3xl border border-black/10">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الوثائق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-black/20 font-arabic"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="space-y-4">
          {mockDocuments.map((doc) => (
            <div key={doc.id} className="bg-[#f2ffff] p-6 rounded-3xl border border-black/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-black font-arabic text-lg">{doc.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getClassificationColor(doc.classification)}`}>
                      <Shield className="w-3 h-3 inline mr-1" />
                      {doc.classification}
                    </div>
                    <Badge variant="secondary" className="font-arabic">
                      {doc.version}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {doc.type} • {doc.size}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {doc.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {doc.author}
                    </span>
                    <span className="flex items-center gap-1 font-arabic">
                      {doc.department}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {doc.tags.map((tag, index) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};
