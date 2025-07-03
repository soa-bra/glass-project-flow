import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Download, 
  Eye, 
  Edit3, 
  Trash2,
  Search,
  Filter,
  Upload
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  size: string;
  uploadDate: string;
  classification: 'Low' | 'Medium' | 'High';
  version: string;
  uploadedBy: string;
  tags: string[];
}

interface DocumentsGridProps {
  documents: Document[];
}

export const DocumentsGrid: React.FC<DocumentsGridProps> = ({ documents = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // بيانات وهمية في حالة عدم وجود مستندات
  const defaultDocuments: Document[] = [
    {
      id: '1',
      name: 'وثيقة المتطلبات الفنية.pdf',
      type: 'document',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      classification: 'High',
      version: 'v2.1',
      uploadedBy: 'أحمد محمد',
      tags: ['متطلبات', 'فني', 'مواصفات']
    },
    {
      id: '2',
      name: 'تصميم واجهة المستخدم.fig',
      type: 'image',
      size: '15.7 MB',
      uploadDate: '2024-01-14',
      classification: 'Medium',
      version: 'v1.3',
      uploadedBy: 'فاطمة أحمد',
      tags: ['تصميم', 'واجهة', 'UX']
    },
    {
      id: '3',
      name: 'عرض تقديمي للعميل.pptx',
      type: 'document',
      size: '8.9 MB',
      uploadDate: '2024-01-13',
      classification: 'Medium',
      version: 'v1.0',
      uploadedBy: 'خالد عبدالرحمن',
      tags: ['عرض', 'عميل', 'تقديم']
    },
    {
      id: '4',
      name: 'فيديو شرح النظام.mp4',
      type: 'video',
      size: '125.3 MB',
      uploadDate: '2024-01-12',
      classification: 'Low',
      version: 'v1.0',
      uploadedBy: 'نورا سعد',
      tags: ['فيديو', 'شرح', 'تدريب']
    },
    {
      id: '5',
      name: 'ملف النسخ الاحتياطية.zip',
      type: 'archive',
      size: '45.2 MB',
      uploadDate: '2024-01-11',
      classification: 'High',
      version: 'v3.0',
      uploadedBy: 'أحمد محمد',
      tags: ['نسخ احتياطي', 'أرشيف']
    }
  ];

  const docs = documents.length > 0 ? documents : defaultDocuments;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      case 'archive':
        return Archive;
      default:
        return FileText;
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getClassificationText = (classification: string) => {
    switch (classification) {
      case 'High':
        return 'عالي';
      case 'Medium':
        return 'متوسط';
      case 'Low':
        return 'منخفض';
      default:
        return 'غير محدد';
    }
  };

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.includes(searchTerm));
    const matchesFilter = selectedFilter === 'all' || doc.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getTypeCount = (type: string) => {
    return docs.filter(doc => doc.type === type).length;
  };

  return (
    <div className="space-y-4">
      {/* شريط البحث والتصفية */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="البحث في المستندات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 text-right"
          />
        </div>
        <Button size="sm" variant="outline" className="gap-1">
          <Upload className="w-4 h-4" />
          رفع
        </Button>
      </div>

      {/* فلاتر سريعة */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          size="sm"
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('all')}
        >
          الكل ({docs.length})
        </Button>
        <Button
          size="sm"
          variant={selectedFilter === 'document' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('document')}
        >
          مستندات ({getTypeCount('document')})
        </Button>
        <Button
          size="sm"
          variant={selectedFilter === 'image' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('image')}
        >
          صور ({getTypeCount('image')})
        </Button>
        <Button
          size="sm"
          variant={selectedFilter === 'video' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('video')}
        >
          فيديو ({getTypeCount('video')})
        </Button>
      </div>

      {/* شبكة المستندات */}
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDocs.map((doc) => {
            const FileIcon = getFileIcon(doc.type);
            
            return (
              <div key={doc.id} className="bg-white/20 rounded-xl p-4 hover:bg-white/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileIcon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getClassificationColor(doc.classification)}>
                        {getClassificationText(doc.classification)}
                      </Badge>
                      <h4 className="font-medium text-sm text-right mr-2 line-clamp-2">
                        {doc.name}
                      </h4>
                    </div>
                    
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>الحجم: {doc.size}</span>
                        <span>الإصدار: {doc.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{doc.uploadDate}</span>
                        <span>{doc.uploadedBy}</span>
                      </div>
                    </div>

                    {/* التاغز */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{doc.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="flex gap-1 mt-3">
                      <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-red-500">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* إحصائيات سريعة */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <p className="font-bold">{docs.length}</p>
            <p className="text-gray-600">إجمالي الملفات</p>
          </div>
          <div>
            <p className="font-bold text-red-600">
              {docs.filter(d => d.classification === 'High').length}
            </p>
            <p className="text-gray-600">عالي الأهمية</p>
          </div>
          <div>
            <p className="font-bold text-blue-600">
              {docs.filter(d => d.uploadDate === '2024-01-15').length}
            </p>
            <p className="text-gray-600">جديدة اليوم</p>
          </div>
          <div>
            <p className="font-bold">2.1 GB</p>
            <p className="text-gray-600">المساحة المستخدمة</p>
          </div>
        </div>
      </div>
    </div>
  );
};