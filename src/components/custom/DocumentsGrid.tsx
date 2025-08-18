import React, { useState } from 'react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { FileText, Image, Video, Music, Archive, Download, Edit3, Trash2, Search, Filter, Folder, FolderOpen, File, MessageCircle, RefreshCw } from 'lucide-react';
import { ProjectFile, Comment } from '@/data/projectFiles';
import { useProjectFiles } from '@/hooks/useProjectFiles';
import { CommentDialog } from './CommentDialog';
import { EditFileDialog } from './EditFileDialog';
import { FilterDialog, FilterOptions } from './FilterDialog';

// تم نقل FolderData إلى projectFilesService

interface DocumentsGridProps {
  onFolderClick?: (folderId: string) => void;
  projectId?: string;
  currentUserId?: string;
}
export const DocumentsGrid: React.FC<DocumentsGridProps> = ({
  onFolderClick,
  projectId = 'current',
  currentUserId = 'current_user'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});

  // استخدام hook البيانات المشتركة
  const {
    files,
    folders,
    getProjectFiles,
    getFolderFiles,
    getFilteredFiles,
    isLoading,
    deleteFile,
    moveFileToFolder,
    updateFile
  } = useProjectFiles(projectId);

  // الحصول على الملفات المفلترة حسب الصلاحيات
  const docs = getFilteredFiles(currentUserId, projectId);
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
  const currentFolders = folders.filter(folder => !currentFolderId ? !folder.parentId : folder.parentId === currentFolderId);
  const currentDocs = docs.filter(doc => {
    const inCurrentFolder = !currentFolderId ? !doc.folderId : doc.folderId === currentFolderId;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.tags.some(tag => tag.includes(searchTerm));
    const matchesFilter = selectedFilter === 'all' || doc.type === selectedFilter;

    // تطبيق الفلاتر الجديدة
    const matchesActiveFilters = (!activeFilters.type || doc.type === activeFilters.type) && (!activeFilters.importance || doc.classification === activeFilters.importance) && (!activeFilters.tags || activeFilters.tags.some(tag => doc.tags.includes(tag)));
    return inCurrentFolder && matchesSearch && matchesFilter && matchesActiveFilters;
  });
  const filteredFolders = currentFolders.filter(folder => folder.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const getTypeCount = (type: string) => {
    return currentDocs.filter(doc => doc.type === type).length;
  };
  const handleDeleteFile = (fileId: string) => {
    if (window.confirm('هل تريد بالتأكيد حذف هذا الملف؟')) {
      deleteFile(fileId);
    }
  };
  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
    onFolderClick?.(folderId);
  };
  const handleBackClick = () => {
    setCurrentFolderId(null);
  };
  const handleCommentClick = (file: ProjectFile) => {
    setSelectedFile(file);
    setCommentDialogOpen(true);
  };
  const handleEditClick = (file: ProjectFile) => {
    setSelectedFile(file);
    setEditDialogOpen(true);
  };
  const handleDownload = (file: ProjectFile) => {
    // تنزيل الملف - يمكن تحسينه لاحقاً للتنزيل الفعلي
    const link = document.createElement('a');
    link.href = '#'; // يجب أن يكون رابط الملف الفعلي
    link.download = file.name;
    link.click();
  };
  const handleAddComment = (fileId: string, commentText: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      author: 'المستخدم الحالي',
      timestamp: new Date().toLocaleString('ar-SA')
    };
    const file = files.find(f => f.id === fileId);
    if (file) {
      const updatedFile = {
        ...file,
        comments: [...(file.comments || []), newComment]
      };
      updateFile(fileId, updatedFile);
    }
  };
  const handleEditFile = (fileId: string, updates: Partial<ProjectFile>) => {
    updateFile(fileId, updates);
  };
  const handleUpdateFile = () => {
    // تحديث البيانات دون إعادة تحميل الصفحة
    getProjectFiles(projectId);
  };
  const handleFilterFile = () => {
    setFilterDialogOpen(true);
  };
  const handleApplyFilter = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  // استخراج التاقز المتاحة من جميع الملفات
  const availableTags = Array.from(new Set(docs.flatMap(doc => doc.tags)));
  return <div className="bg-[#FFFFFF] rounded-[41px] p-6 border border-[#DADCE0]">
      {/* شريط التنقل */}
      {currentFolderId && <div className="flex items-center gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={handleBackClick} className="rounded-full bg-black text-sm text-white">
            ← العودة
          </Button>
          <span className="text-sm text-gray-600">
            {folders.find(f => f.id === currentFolderId)?.name}
          </span>
        </div>}

      {/* شريط البحث */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="البحث في المرفقات..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-[#FFFFFF] border border-[#DADCE0] rounded-full" />
        </div>
        <button onClick={handleUpdateFile} className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95">
          <RefreshCw size={16} />
        </button>
        <button onClick={handleFilterFile} className="w-8 h-8 rounded-full flex items-center justify-center text-black transition-all duration-300 border border-black/80 bg-transparent hover:bg-black/5 hover:scale-105 active:scale-95">
          <Filter size={16} />
        </button>
      </div>


      {/* شبكة المجلدات والمستندات */}
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {/* عرض المجلدات أولاً */}
          {filteredFolders.map(folder => {
          const FolderIcon = getFolderIcon(folder.icon);
          return <div key={`folder-${folder.id}`} className="bg-white/40 rounded-3xl p-4 border border-black/10 cursor-pointer hover:bg-white/60 transition-all" onClick={() => handleFolderClick(folder.id)}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{
                backgroundColor: folder.color || '#a4e2f6'
              }}>
                    <FolderIcon className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1 text-right">
                    <h4 className="font-medium text-sm text-black">{folder.name}</h4>
                    <p className="text-xs text-gray-600">{folder.filesCount} ملف</p>
                    <p className="text-xs text-gray-500">{new Date(folder.createdAt).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              </div>;
        })}

          {/* عرض الملفات */}
          {currentDocs.map(doc => {
          const FileIcon = getFileIcon(doc.type);
          return <div key={doc.id} className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#DADCE0] px-[20px] py-[15px]">
                <div className="flex items-start gap-3">
                  
                  <div className="flex-1 min-w-0 mx-px">
                    <div className="flex items-start justify-between mb-2">
                      <BaseBadge variant="secondary" className={getClassificationColor(doc.classification)}>
                        {getClassificationText(doc.classification)}
                      </BaseBadge>
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
                      {doc.tags.slice(0, 2).map((tag, idx) => <BaseBadge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </BaseBadge>)}
                      {doc.tags.length > 2 && <BaseBadge variant="secondary" className="text-xs">
                          +{doc.tags.length - 2}
                        </BaseBadge>}
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="flex gap-1 mt-3">
                      <Button size="sm" variant="ghost" className="p-1 h-6 w-6 relative" onClick={() => handleCommentClick(doc)}>
                        <MessageCircle className="w-3 h-3" />
                        {doc.comments && doc.comments.length > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {doc.comments.length}
                          </span>}
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1 h-6 w-6" onClick={() => handleDownload(doc)}>
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1 h-6 w-6" onClick={() => handleEditClick(doc)}>
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-red-500" onClick={() => handleDeleteFile(doc.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>;
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

      {/* نوافذ الحوار */}
      <CommentDialog isOpen={commentDialogOpen} onClose={() => {
      setCommentDialogOpen(false);
      setSelectedFile(null);
    }} fileId={selectedFile?.id || ''} fileName={selectedFile?.name || ''} comments={selectedFile?.comments || []} onAddComment={handleAddComment} />

      <EditFileDialog isOpen={editDialogOpen} onClose={() => {
      setEditDialogOpen(false);
      setSelectedFile(null);
    }} file={selectedFile} onSave={handleEditFile} projectTasks={[{
      id: '1',
      title: 'تصميم واجهة المستخدم'
    }, {
      id: '2',
      title: 'تطوير قاعدة البيانات'
    }, {
      id: '3',
      title: 'اختبار النظام'
    }, {
      id: '4',
      title: 'كتابة الوثائق'
    }, {
      id: '5',
      title: 'مراجعة الكود'
    }]} />

      <FilterDialog isOpen={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} onApplyFilter={handleApplyFilter} projectTasks={[{
      id: '1',
      title: 'تصميم واجهة المستخدم'
    }, {
      id: '2',
      title: 'تطوير قاعدة البيانات'
    }, {
      id: '3',
      title: 'اختبار النظام'
    }, {
      id: '4',
      title: 'كتابة الوثائق'
    }, {
      id: '5',
      title: 'مراجعة الكود'
    }]} availableTags={availableTags} />
    </div>;
};