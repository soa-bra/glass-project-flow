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

  // قائمة ملفات المشروع الفعلية
  const projectFiles: Document[] = [
    // ملفات الكود والمكونات
    { id: '1', name: 'main.tsx', type: 'document', size: '2.1 KB', uploadDate: '2024-01-15', classification: 'High', version: 'v1.0', uploadedBy: 'المطور', tags: ['TypeScript', 'React', 'كود'] },
    { id: '2', name: 'App.tsx', type: 'document', size: '5.8 KB', uploadDate: '2024-01-15', classification: 'High', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'تطبيق', 'كود'] },
    { id: '3', name: 'index.css', type: 'document', size: '12.3 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['CSS', 'تصميم', 'أنماط'] },
    
    // مكونات الواجهة
    { id: '4', name: 'DocumentsGrid.tsx', type: 'document', size: '18.7 KB', uploadDate: '2024-01-15', classification: 'High', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'مكون', 'ملفات'] },
    { id: '5', name: 'OperationsBoard.tsx', type: 'document', size: '25.4 KB', uploadDate: '2024-01-15', classification: 'High', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'لوحة', 'عمليات'] },
    { id: '6', name: 'CanvasBoard.tsx', type: 'document', size: '32.1 KB', uploadDate: '2024-01-15', classification: 'High', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'لوحة', 'رسم'] },
    
    // مكونات الـUI
    { id: '7', name: 'button.tsx', type: 'document', size: '3.2 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['UI', 'زر', 'مكون'] },
    { id: '8', name: 'input.tsx', type: 'document', size: '2.8 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['UI', 'إدخال', 'مكون'] },
    { id: '9', name: 'badge.tsx', type: 'document', size: '1.9 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['UI', 'شارة', 'مكون'] },
    { id: '10', name: 'dialog.tsx', type: 'document', size: '4.5 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['UI', 'حوار', 'مكون'] },
    
    // ملفات التكوين
    { id: '11', name: 'tailwind.config.ts', type: 'document', size: '8.9 KB', uploadDate: '2024-01-15', classification: 'High', version: 'v1.0', uploadedBy: 'المطور', tags: ['تكوين', 'Tailwind', 'أنماط'] },
    { id: '12', name: 'tsconfig.json', type: 'document', size: '1.2 KB', uploadDate: '2024-01-15', classification: 'High', version: 'v1.0', uploadedBy: 'المطور', tags: ['تكوين', 'TypeScript'] },
    { id: '13', name: 'package.json', type: 'document', size: '3.8 KB', uploadDate: '2024-01-15', classification: 'High', version: 'v1.0', uploadedBy: 'المطور', tags: ['تكوين', 'NPM', 'تبعيات'] },
    { id: '14', name: 'vite.config.ts', type: 'document', size: '1.5 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['تكوين', 'Vite', 'بناء'] },
    { id: '15', name: 'components.json', type: 'document', size: '0.8 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['تكوين', 'مكونات'] },
    
    // ملفات التوثيق
    { id: '16', name: 'README.md', type: 'document', size: '4.2 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['توثيق', 'Markdown'] },
    { id: '17', name: 'CHANGELOG.md', type: 'document', size: '2.1 KB', uploadDate: '2024-01-15', classification: 'Low', version: 'v1.0', uploadedBy: 'المطور', tags: ['توثيق', 'تغييرات'] },
    { id: '18', name: 'OPERATIONS_BOARD_COMPLETION_PLAN.md', type: 'document', size: '8.7 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['توثيق', 'خطة', 'مشروع'] },
    { id: '19', name: 'REFACTORING_SUMMARY.md', type: 'document', size: '5.3 KB', uploadDate: '2024-01-15', classification: 'Low', version: 'v1.0', uploadedBy: 'المطور', tags: ['توثيق', 'إعادة هيكلة'] },
    
    // ملفات HTML وCSS
    { id: '20', name: 'index.html', type: 'document', size: '1.1 KB', uploadDate: '2024-01-15', classification: 'High', version: 'v1.0', uploadedBy: 'المطور', tags: ['HTML', 'صفحة رئيسية'] },
    { id: '21', name: 'postcss.config.js', type: 'document', size: '0.3 KB', uploadDate: '2024-01-15', classification: 'Low', version: 'v1.0', uploadedBy: 'المطور', tags: ['CSS', 'تكوين'] },
    
    // ملفات الصور والرموز
    { id: '22', name: 'favicon.ico', type: 'image', size: '15.1 KB', uploadDate: '2024-01-15', classification: 'Low', version: 'v1.0', uploadedBy: 'المطور', tags: ['أيقونة', 'متصفح'] },
    { id: '23', name: 'placeholder.svg', type: 'image', size: '2.3 KB', uploadDate: '2024-01-15', classification: 'Low', version: 'v1.0', uploadedBy: 'المطور', tags: ['SVG', 'بديل'] },
    
    // ملفات أمان ونظام
    { id: '24', name: '.gitignore', type: 'document', size: '0.5 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['Git', 'تحكم إصدارات'] },
    { id: '25', name: 'bun.lockb', type: 'archive', size: '125.8 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'النظام', tags: ['تبعيات', 'قفل'] },
    { id: '26', name: 'package-lock.json', type: 'document', size: '890.2 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'النظام', tags: ['NPM', 'تبعيات', 'قفل'] },
    
    // مكونات متقدمة
    { id: '27', name: 'BaseCard.tsx', type: 'document', size: '6.8 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'بطاقة', 'أساسي'] },
    { id: '28', name: 'GenericCard.tsx', type: 'document', size: '4.9 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'بطاقة', 'عام'] },
    { id: '29', name: 'SoaBraBadge.tsx', type: 'document', size: '3.1 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'شارة', 'علامة تجارية'] },
    
    // مكونات لوحة الرسم
    { id: '30', name: 'MainToolbar.tsx', type: 'document', size: '12.4 KB', uploadDate: '2024-01-15', classification: 'High', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'أدوات', 'شريط'] },
    { id: '31', name: 'ToolCustomizationPanel.tsx', type: 'document', size: '8.7 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'لوحة', 'تخصيص'] },
    { id: '32', name: 'SelectionToolPanel.tsx', type: 'document', size: '5.2 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'أداة', 'تحديد'] },
    { id: '33', name: 'SmartPenToolPanel.tsx', type: 'document', size: '6.1 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'قلم', 'ذكي'] },
    { id: '34', name: 'ZoomToolPanel.tsx', type: 'document', size: '4.3 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'زوم', 'تكبير'] },
    { id: '35', name: 'TextToolPanel.tsx', type: 'document', size: '7.8 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'نص', 'أداة'] },
    { id: '36', name: 'ShapesToolPanel.tsx', type: 'document', size: '9.6 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['React', 'أشكال', 'أداة'] },
    
    // ملفات الثوابت والتكوين
    { id: '37', name: 'constants.ts', type: 'document', size: '3.7 KB', uploadDate: '2024-01-15', classification: 'Medium', version: 'v1.0', uploadedBy: 'المطور', tags: ['TypeScript', 'ثوابت'] },
    { id: '38', name: 'index.ts', type: 'document', size: '0.8 KB', uploadDate: '2024-01-15', classification: 'Low', version: 'v1.0', uploadedBy: 'المطور', tags: ['TypeScript', 'تصدير'] }
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