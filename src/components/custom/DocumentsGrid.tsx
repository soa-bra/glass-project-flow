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
  Upload,
  Folder,
  FolderOpen,
  File
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
  folderId?: string;
}

interface FolderData {
  id: string;
  name: string;
  parentId?: string;
  filesCount: number;
  createdAt: string;
  color?: string;
  icon?: string;
  files?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
  }>;
}

interface DocumentsGridProps {
  documents?: Document[];
  folders?: FolderData[];
  onFolderClick?: (folderId: string) => void;
}
export const DocumentsGrid: React.FC<DocumentsGridProps> = ({
  documents = [],
  folders = [],
  onFolderClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // قائمة ملفات المشروع المطابقة لنافذة إدارة الصلاحيات
  const projectFiles: Document[] = [
    // وثائق المشروع
    {
      id: 'file1',
      name: 'وثيقة متطلبات المشروع.pdf',
      type: 'document',
      size: '3.2 MB',
      uploadDate: '2024-01-20',
      classification: 'High',
      version: 'v1.0',
      uploadedBy: 'أحمد محمد',
      tags: ['وثيقة', 'متطلبات', 'مشروع']
    },
    {
      id: 'file2',
      name: 'خطة المشروع التفصيلية.docx',
      type: 'document',
      size: '1.8 MB',
      uploadDate: '2024-01-19',
      classification: 'High',
      version: 'v1.0',
      uploadedBy: 'فاطمة أحمد',
      tags: ['خطة', 'مشروع', 'تفصيلية']
    },
    {
      id: 'file3',
      name: 'مواصفات النظام الفنية.pdf',
      type: 'document',
      size: '4.1 MB',
      uploadDate: '2024-01-18',
      classification: 'High',
      version: 'v1.0',
      uploadedBy: 'خالد سعد',
      tags: ['مواصفات', 'نظام', 'فنية']
    },
    // تصاميم وواجهات
    {
      id: 'file4',
      name: 'تصميم واجهة المستخدم.fig',
      type: 'image',
      size: '15.7 MB',
      uploadDate: '2024-01-17',
      classification: 'Medium',
      version: 'v1.0',
      uploadedBy: 'نورا عبدالله',
      tags: ['تصميم', 'واجهة', 'مستخدم']
    },
    {
      id: 'file5',
      name: 'نماذج أولية للتطبيق.sketch',
      type: 'image',
      size: '22.3 MB',
      uploadDate: '2024-01-16',
      classification: 'Medium',
      version: 'v1.0',
      uploadedBy: 'فاطمة أحمد',
      tags: ['نماذج', 'أولية', 'تطبيق']
    },
    {
      id: 'file6',
      name: 'أيقونات النظام.svg',
      type: 'image',
      size: '892 KB',
      uploadDate: '2024-01-15',
      classification: 'Medium',
      version: 'v1.0',
      uploadedBy: 'نورا عبدالله',
      tags: ['أيقونات', 'نظام', 'SVG']
    },
    // عروض تقديمية
    {
      id: 'file7',
      name: 'عرض المشروع للعميل.pptx',
      type: 'document',
      size: '8.9 MB',
      uploadDate: '2024-01-14',
      classification: 'Medium',
      version: 'v1.0',
      uploadedBy: 'أحمد محمد',
      tags: ['عرض', 'مشروع', 'عميل']
    },
    {
      id: 'file8',
      name: 'تقرير التقدم الشهري.pptx',
      type: 'document',
      size: '5.6 MB',
      uploadDate: '2024-01-13',
      classification: 'Medium',
      version: 'v1.0',
      uploadedBy: 'خالد سعد',
      tags: ['تقرير', 'تقدم', 'شهري']
    },
    // ملفات الوسائط
    {
      id: 'file9',
      name: 'فيديو شرح النظام.mp4',
      type: 'video',
      size: '125.3 MB',
      uploadDate: '2024-01-12',
      classification: 'Low',
      version: 'v1.0',
      uploadedBy: 'فاطمة أحمد',
      tags: ['فيديو', 'شرح', 'نظام']
    },
    {
      id: 'file10',
      name: 'تسجيل اجتماع الفريق.mp4',
      type: 'video',
      size: '89.7 MB',
      uploadDate: '2024-01-11',
      classification: 'Low',
      version: 'v1.0',
      uploadedBy: 'نورا عبدالله',
      tags: ['تسجيل', 'اجتماع', 'فريق']
    },
    {
      id: 'file11',
      name: 'صور واجهة النظام.zip',
      type: 'archive',
      size: '12.4 MB',
      uploadDate: '2024-01-10',
      classification: 'Medium',
      version: 'v1.0',
      uploadedBy: 'أحمد محمد',
      tags: ['صور', 'واجهة', 'نظام']
    },
    // ملفات البرمجة والكود
    {
      id: 'file12',
      name: 'كود المشروع الأساسي.zip',
      type: 'archive',
      size: '45.2 MB',
      uploadDate: '2024-01-09',
      classification: 'High',
      version: 'v1.0',
      uploadedBy: 'خالد سعد',
      tags: ['كود', 'مشروع', 'أساسي']
    },
    {
      id: 'file13',
      name: 'ملفات قاعدة البيانات.sql',
      type: 'other',
      size: '2.8 MB',
      uploadDate: '2024-01-08',
      classification: 'High',
      version: 'v1.0',
      uploadedBy: 'فاطمة أحمد',
      tags: ['قاعدة بيانات', 'SQL', 'ملفات']
    },
    {
      id: 'file14',
      name: 'ملفات الإعدادات والبيئة.json',
      type: 'other',
      size: '156 KB',
      uploadDate: '2024-01-07',
      classification: 'High',
      version: 'v1.0',
      uploadedBy: 'أحمد محمد',
      tags: ['إعدادات', 'بيئة', 'JSON']
    },
    // ملفات البيانات والتقارير
    {
      id: 'file15',
      name: 'بيانات العملاء.xlsx',
      type: 'document',
      size: '3.7 MB',
      uploadDate: '2024-01-06',
      classification: 'High',
      version: 'v1.0',
      uploadedBy: 'نورا عبدالله',
      tags: ['بيانات', 'عملاء', 'جدول']
    },
    {
      id: 'file16',
      name: 'تقرير الاختبارات.xlsx',
      type: 'document',
      size: '1.9 MB',
      uploadDate: '2024-01-05',
      classification: 'Medium',
      version: 'v1.0',
      uploadedBy: 'خالد سعد',
      tags: ['تقرير', 'اختبارات', 'جدول']
    },
    // أرشيف ونسخ احتياطية
    {
      id: 'file17',
      name: 'نسخة احتياطية كاملة.zip',
      type: 'archive',
      size: '256.8 MB',
      uploadDate: '2024-01-04',
      classification: 'High',
      version: 'v1.0',
      uploadedBy: 'أحمد محمد',
      tags: ['نسخة احتياطية', 'كاملة', 'أرشيف']
    },
    {
      id: 'file18',
      name: 'أرشيف الإصدار السابق.tar.gz',
      type: 'archive',
      size: '178.4 MB',
      uploadDate: '2024-01-03',
      classification: 'High',
      version: 'v1.0',
      uploadedBy: 'فاطمة أحمد',
      tags: ['أرشيف', 'إصدار سابق', 'ضغط']
    }
  ];
  const docs = documents.length > 0 ? documents : projectFiles;
  // الحصول على أيقونة المجلد
  const getFolderIcon = (iconId?: string) => {
    switch (iconId) {
      case 'folder-open':
        return FolderOpen;
      case 'archive':
        return Archive;
      case 'file-text':
        return FileText;
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'music':
        return Music;
      case 'file':
        return File;
      default:
        return Folder;
    }
  };

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
  // فلترة المجلدات والملفات حسب المجلد الحالي
  const currentFolders = folders.filter(folder => 
    !currentFolderId ? !folder.parentId : folder.parentId === currentFolderId
  );
  
  const currentDocs = docs.filter(doc => {
    const inCurrentFolder = !currentFolderId ? !doc.folderId : doc.folderId === currentFolderId;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.tags.some(tag => tag.includes(searchTerm));
    const matchesFilter = selectedFilter === 'all' || doc.type === selectedFilter;
    return inCurrentFolder && matchesSearch && matchesFilter;
  });

  const filteredFolders = currentFolders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeCount = (type: string) => {
    return currentDocs.filter(doc => doc.type === type).length;
  };

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
    onFolderClick?.(folderId);
  };

  const handleBackClick = () => {
    setCurrentFolderId(null);
  };
  return <div className="bg-[#F2FFFF] rounded-3xl p-6 text-center border border-black/10">
      {/* شريط التنقل */}
      {currentFolderId && (
        <div className="flex items-center gap-2 mb-4">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleBackClick}
            className="rounded-full"
          >
            ← العودة
          </Button>
          <span className="text-sm text-gray-600">
            {folders.find(f => f.id === currentFolderId)?.name}
          </span>
        </div>
      )}

      {/* شريط البحث والتصفية */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="البحث في المستندات..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pr-10 text-right" />
        </div>
        <Button size="sm" variant="outline" className="gap-1 text-white bg-black rounded-full">
          <Upload className="w-4 h-4" />
          رفع
        </Button>
      </div>

      {/* فلاتر سريعة */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        <Button size="sm" variant={selectedFilter === 'all' ? 'default' : 'outline'} onClick={() => setSelectedFilter('all')} className="rounded-full">
          الكل ({currentDocs.length})
        </Button>
        <Button size="sm" variant={selectedFilter === 'document' ? 'default' : 'outline'} onClick={() => setSelectedFilter('document')} className="rounded-full">
          مستندات ({getTypeCount('document')})
        </Button>
        <Button size="sm" variant={selectedFilter === 'image' ? 'default' : 'outline'} onClick={() => setSelectedFilter('image')} className="rounded-full">
          صور ({getTypeCount('image')})
        </Button>
        <Button size="sm" variant={selectedFilter === 'video' ? 'default' : 'outline'} onClick={() => setSelectedFilter('video')} className="rounded-full">
          فيديو ({getTypeCount('video')})
        </Button>
      </div>

      {/* شبكة المجلدات والمستندات */}
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* عرض المجلدات أولاً */}
          {filteredFolders.map(folder => {
            const FolderIcon = getFolderIcon(folder.icon);
            return (
              <div 
                key={`folder-${folder.id}`} 
                className="bg-white/40 rounded-3xl p-4 border border-black/10 cursor-pointer hover:bg-white/60 transition-all"
                onClick={() => handleFolderClick(folder.id)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: folder.color || '#a4e2f6' }}
                  >
                    <FolderIcon className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1 text-right">
                    <h4 className="font-medium text-sm text-black">{folder.name}</h4>
                    <p className="text-xs text-gray-600">{folder.filesCount} ملف</p>
                    <p className="text-xs text-gray-500">{new Date(folder.createdAt).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* عرض الملفات */}
          {currentDocs.map(doc => {
            const FileIcon = getFileIcon(doc.type);
            return (
              <div key={doc.id} className="bg-[#F2FFFF] rounded-3xl p-4 border border-black/10">
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
    </div>;
};