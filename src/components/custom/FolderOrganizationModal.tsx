import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { 
  FolderPlus, 
  X, 
  Folder, 
  Edit3, 
  Trash2, 
  Move, 
  FileText,
  FolderOpen,
  Archive,
  Image,
  Video,
  Music,
  File,
  Plus,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FolderEditModal } from './FolderEditModal';
import { useProjectFiles } from '@/hooks/useProjectFiles';

interface FolderOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    folders: FolderData[];
    actions: FolderAction[];
  }) => void;
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

interface FolderAction {
  type: 'create' | 'rename' | 'delete' | 'move';
  folderId?: string;
  newName?: string;
  newParentId?: string;
}

export const FolderOrganizationModal: React.FC<FolderOrganizationModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { toast } = useToast();
  const { files: projectFiles, updateFileFolder } = useProjectFiles('current');
  
  // المجلدات الموجودة حالياً
  const [folders, setFolders] = useState<FolderData[]>([
    {
      id: '1',
      name: 'مستندات المشروع',
      filesCount: 2,
      createdAt: '2024-01-15',
      color: '#a4e2f6',
      icon: 'folder',
      files: [
        { id: 'file1', name: 'مواصفات المشروع.pdf', type: 'application/pdf', size: 2048000, uploadedAt: '2024-01-15T10:00:00Z' },
        { id: 'file2', name: 'خطة العمل.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 1024000, uploadedAt: '2024-01-16T14:30:00Z' }
      ]
    },
    {
      id: '2', 
      name: 'التصاميم',
      filesCount: 2,
      createdAt: '2024-01-18',
      color: '#d9d2fd',
      icon: 'image',
      files: [
        { id: 'file3', name: 'تصميم الواجهة.png', type: 'image/png', size: 5120000, uploadedAt: '2024-01-18T09:15:00Z' },
        { id: 'file4', name: 'الشعار.svg', type: 'image/svg+xml', size: 256000, uploadedAt: '2024-01-19T11:45:00Z' }
      ]
    },
    {
      id: '3',
      name: 'تقارير',
      filesCount: 1,
      createdAt: '2024-01-20',
      color: '#bdeed3',
      icon: 'file-text',
      files: [
        { id: 'file5', name: 'تقرير الأداء.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 3072000, uploadedAt: '2024-01-20T16:20:00Z' }
      ]
    }
  ]);

  // تحويل ملفات المشروع لتنسيق مناسب للنافذة
  const convertedProjectFiles = projectFiles.map(file => ({
    id: file.id,
    name: file.name,
    type: file.type === 'document' ? 'application/pdf' : 
          file.type === 'image' ? 'image/png' : 
          file.type === 'video' ? 'video/mp4' : 
          file.type === 'audio' ? 'audio/mp3' : 
          file.type === 'archive' ? 'application/zip' : 
          'application/octet-stream',
    size: parseInt(file.size.replace(/[^\d]/g, '')) * 1024 * 1024, // تحويل من MB إلى bytes
    uploadedAt: file.uploadDate
  }));

  const [actions, setActions] = useState<FolderAction[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#a4e2f6');
  const [selectedIcon, setSelectedIcon] = useState('folder');
  const [showFolderEditModal, setShowFolderEditModal] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<FolderData | null>(null);
  const [showFileSelection, setShowFileSelection] = useState<string | null>(null);

  const folderColors = [
    '#a4e2f6', '#d9d2fd', '#bdeed3', '#fbe2aa', '#f1b5b9'
  ];

  // الأيقونات المتاحة للمجلدات
  const folderIcons = [
    { id: 'folder', icon: Folder, name: 'مجلد عادي' },
    { id: 'folder-open', icon: FolderOpen, name: 'مجلد مفتوح' },
    { id: 'archive', icon: Archive, name: 'أرشيف' },
    { id: 'file-text', icon: FileText, name: 'مستندات' },
    { id: 'image', icon: Image, name: 'صور' },
    { id: 'video', icon: Video, name: 'فيديو' },
    { id: 'music', icon: Music, name: 'موسيقى' },
    { id: 'file', icon: File, name: 'ملفات عامة' },
  ];

  const handleAdvancedEdit = (folder: FolderData) => {
    setFolderToEdit(folder);
    setShowFolderEditModal(true);
  };

  const handleFolderEditSave = (updatedFolder: FolderData) => {
    setFolders(prev => 
      prev.map(f => f.id === updatedFolder.id ? updatedFolder : f)
    );
    setActions(prev => [...prev, { 
      type: 'rename', 
      folderId: updatedFolder.id, 
      newName: updatedFolder.name 
    }]);
    setShowFolderEditModal(false);
    setFolderToEdit(null);
  };

  const handleUpdateFolderIcon = (folderId: string, iconId: string) => {
    setFolders(prev => 
      prev.map(folder => 
        folder.id === folderId 
          ? { ...folder, icon: iconId }
          : folder
      )
    );
    
    toast({
      title: "تم تحديث أيقونة المجلد",
      description: "تم تغيير أيقونة المجلد بنجاح",
    });
  };

  const handleAddFileToFolder = (folderId: string, fileId: string) => {
    // التحقق من أن الملف غير موجود في المجلد
    const folder = folders.find(f => f.id === folderId);
    if (folder?.files?.some(f => f.id === fileId)) {
      toast({
        title: "الملف موجود بالفعل",
        description: "هذا الملف موجود بالفعل في المجلد",
        variant: "destructive",
      });
      return;
    }

    const fileToAdd = convertedProjectFiles.find(f => f.id === fileId);
    if (!fileToAdd) return;

    setFolders(prev => 
      prev.map(folder => 
        folder.id === folderId 
          ? { 
              ...folder, 
              files: [...(folder.files || []), fileToAdd],
              filesCount: (folder.files?.length || 0) + 1
            }
          : folder
      )
    );
    
    setShowFileSelection(null);
    
    toast({
      title: "تم إضافة الملف",
      description: `تم إضافة "${fileToAdd.name}" للمجلد بنجاح`,
    });
  };

  const handleRemoveFileFromFolder = (folderId: string, fileId: string) => {
    const folder = folders.find(f => f.id === folderId);
    const file = folder?.files?.find(f => f.id === fileId);
    
    if (file && window.confirm(`هل تريد بالتأكيد إزالة "${file.name}" من المجلد؟`)) {
      // تحديث البيانات المشتركة - إزالة الملف من المجلد
      const success = updateFileFolder(fileId, undefined);
      
      if (success) {
        setFolders(prev => 
          prev.map(folder => 
            folder.id === folderId 
              ? { 
                  ...folder, 
                  files: folder.files?.filter(f => f.id !== fileId) || [],
                  filesCount: Math.max(0, folder.filesCount - 1)
                }
              : folder
          )
        );
        
        toast({
          title: "تم إزالة الملف",
          description: `تم إزالة "${file.name}" من المجلد وإعادته للملفات العامة`,
        });
      } else {
        toast({
          title: "خطأ في إزالة الملف",
          description: "لم يتم العثور على الملف في البيانات المشتركة",
          variant: "destructive",
        });
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (fileType.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (fileType.includes('pdf') || fileType.includes('doc')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  // الحصول على الملفات المتاحة للإضافة (غير موجودة في المجلد حالياً)
  const getAvailableFiles = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    const folderFileIds = folder?.files?.map(f => f.id) || [];
    return convertedProjectFiles.filter(file => !folderFileIds.includes(file.id));
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "اسم المجلد مطلوب",
        description: "يرجى إدخال اسم للمجلد الجديد",
        variant: "destructive",
      });
      return;
    }

    const newFolder: FolderData = {
      id: Date.now().toString(),
      name: newFolderName,
      filesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      color: selectedColor,
      icon: selectedIcon
    };

    setFolders(prev => [...prev, newFolder]);
    setActions(prev => [...prev, { type: 'create', folderId: newFolder.id }]);
    setNewFolderName('');
    
    toast({
      title: "تم إنشاء المجلد",
      description: `تم إنشاء مجلد "${newFolderName}" بنجاح`,
    });
  };

  const handleStartEdit = (folder: FolderData) => {
    setEditingFolder(folder.id);
    setEditingName(folder.name);
  };

  const handleSaveEdit = () => {
    if (!editingName.trim()) {
      toast({
        title: "اسم المجلد مطلوب",
        description: "يرجى إدخال اسم صحيح للمجلد",
        variant: "destructive",
      });
      return;
    }

    setFolders(prev => 
      prev.map(folder => 
        folder.id === editingFolder 
          ? { ...folder, name: editingName }
          : folder
      )
    );

    setActions(prev => [...prev, { 
      type: 'rename', 
      folderId: editingFolder!, 
      newName: editingName 
    }]);

    setEditingFolder(null);
    setEditingName('');
    
    toast({
      title: "تم تحديث اسم المجلد",
      description: "تم حفظ الاسم الجديد بنجاح",
    });
  };

  const handleCancelEdit = () => {
    setEditingFolder(null);
    setEditingName('');
  };

  const handleDeleteFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    if (folder.filesCount > 0) {
      toast({
        title: "لا يمكن حذف المجلد",
        description: "المجلد يحتوي على ملفات. يرجى نقل الملفات أولاً",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`هل تريد بالتأكيد حذف مجلد "${folder.name}"؟`)) {
      setFolders(prev => prev.filter(f => f.id !== folderId));
      setActions(prev => [...prev, { type: 'delete', folderId }]);
      
      toast({
        title: "تم حذف المجلد",
        description: `تم حذف مجلد "${folder.name}" بنجاح`,
      });
    }
  };

  const handleSave = () => {
    onSave({
      folders,
      actions
    });
    onClose();
  };

  const handleClose = () => {
    setActions([]);
    setNewFolderName('');
    setEditingFolder(null);
    setEditingName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] p-0 overflow-hidden font-arabic"
        style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          zIndex: 9999,
        }}
        >
          <DialogTitle className="sr-only">تنظيم المجلدات</DialogTitle>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">تنظيم المجلدات</h2>
              <p className="text-sm text-black/70">إنشاء وتنظيم مجلدات المشروع</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-transparent hover:bg-black/5 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* إنشاء مجلد جديد */}
            <div className="bg-white/30 rounded-3xl p-6 border border-black/10">
              <h3 className="text-lg font-bold text-black mb-4">إنشاء مجلد جديد</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-black">اسم المجلد</label>
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="أدخل اسم المجلد..."
                      className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-black">لون المجلد</label>
                    <div className="flex gap-2">
                      {folderColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            selectedColor === color 
                              ? 'border-black scale-110' 
                              : 'border-black/20 hover:border-black/40'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* اختيار أيقونة المجلد */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-black">أيقونة المجلد</label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {folderIcons.map((iconData) => {
                      const IconComponent = iconData.icon;
                      return (
                        <button
                          key={iconData.id}
                          onClick={() => setSelectedIcon(iconData.id)}
                          className={`p-2 rounded-xl border transition-all hover:scale-105 ${
                            selectedIcon === iconData.id
                              ? 'border-black bg-black/10 scale-105'
                              : 'border-black/20 bg-white/20 hover:border-black/40'
                          }`}
                          title={iconData.name}
                        >
                          <IconComponent className="w-5 h-5 text-black mx-auto" />
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <button
                  onClick={handleCreateFolder}
                  className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium transition-colors flex items-center gap-2"
                >
                  <FolderPlus className="w-4 h-4" />
                  إنشاء مجلد
                </button>
              </div>
            </div>

            {/* المجلدات الموجودة */}
            <div className="bg-white/30 rounded-3xl p-6 border border-black/10">
              <h3 className="text-lg font-bold text-black mb-4">المجلدات الموجودة</h3>
              
              <div className="space-y-6">
                {folders.map((folder) => {
                  const FolderIconComponent = folderIcons.find(icon => icon.id === (folder.icon || 'folder'))?.icon || Folder;
                  
                  return (
                    <div key={folder.id} className="bg-white/20 rounded-2xl p-4 border border-black/10 space-y-4">
                      {/* معلومات المجلد الأساسية */}
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: folder.color }}
                        >
                          <FolderIconComponent className="w-6 h-6 text-black" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {editingFolder === folder.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="flex-1 px-3 py-2 bg-white/50 border border-black/20 rounded-xl text-black focus:outline-none focus:border-black"
                                autoFocus
                              />
                              <button
                                onClick={handleSaveEdit}
                                className="px-3 py-2 bg-black text-white rounded-xl text-xs hover:bg-black/90 transition-colors"
                              >
                                حفظ
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-2 bg-white/30 border border-black/20 text-black rounded-xl text-xs hover:bg-white/40 transition-colors"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <>
                              <h4 className="font-medium text-black text-lg">{folder.name}</h4>
                              <div className="flex items-center gap-4 text-xs text-black/70">
                                <span className="flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  {folder.filesCount} ملف
                                </span>
                                <span>تم الإنشاء: {folder.createdAt}</span>
                              </div>
                            </>
                          )}
                        </div>
                        
                        {editingFolder !== folder.id && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAdvancedEdit(folder)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-colors"
                              title="تعديل متقدم"
                            >
                              <Edit3 className="w-4 h-4 text-blue-600" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteFolder(folder.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors"
                              title="حذف المجلد"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>


                      {/* إدارة الملفات */}
                      {editingFolder !== folder.id && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-bold text-black">الملفات في المجلد:</h5>
                            <div className="relative">
                              <button
                                onClick={() => setShowFileSelection(showFileSelection === folder.id ? null : folder.id)}
                                className="px-3 py-1 bg-black hover:bg-black/90 rounded-full text-white text-xs font-medium transition-colors flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                إضافة من المشروع
                              </button>
                              
                              {/* قائمة الملفات المتاحة */}
                              {showFileSelection === folder.id && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-black/20 shadow-lg z-10 max-h-48 overflow-y-auto">
                                  <div className="p-3">
                                    <h6 className="text-sm font-bold text-black mb-2">اختر ملف من المشروع:</h6>
                                    {getAvailableFiles(folder.id).length > 0 ? (
                                      <div className="space-y-2">
                                        {getAvailableFiles(folder.id).map((file) => (
                                          <button
                                            key={file.id}
                                            onClick={() => handleAddFileToFolder(folder.id, file.id)}
                                            className="w-full text-right p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2"
                                          >
                                            <div className="w-6 h-6 bg-black/10 rounded-lg flex items-center justify-center">
                                              {getFileIcon(file.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs font-medium text-black truncate">{file.name}</p>
                                              <p className="text-xs text-black/60">{formatFileSize(file.size)}</p>
                                            </div>
                                          </button>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-black/60 text-center py-4">
                                        جميع ملفات المشروع موجودة في هذا المجلد
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {folder.files && folder.files.length > 0 ? (
                              folder.files.map((file) => (
                                <div key={file.id} className="flex items-center gap-2 p-2 bg-white/30 rounded-xl">
                                  <div className="w-6 h-6 bg-black/10 rounded-lg flex items-center justify-center">
                                    {getFileIcon(file.type)}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-black truncate">{file.name}</p>
                                    <p className="text-xs text-black/60">{formatFileSize(file.size)}</p>
                                  </div>
                                  
                                  <button
                                    onClick={() => handleRemoveFileFromFolder(folder.id, file.id)}
                                    className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                    title="إزالة من المجلد"
                                  >
                                    <X className="w-3 h-3 text-red-600" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-4">
                                <Upload className="w-8 h-8 text-black/30 mx-auto mb-2" />
                                <p className="text-xs text-black/60">لا توجد ملفات في هذا المجلد</p>
                                <p className="text-xs text-black/50">انقر على "إضافة من المشروع" لإضافة ملفات</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {folders.length === 0 && (
                  <div className="text-center py-8">
                    <Folder className="w-12 h-12 text-black/30 mx-auto mb-3" />
                    <p className="text-black/70">لا توجد مجلدات حالياً</p>
                    <p className="text-xs text-black/50">قم بإنشاء مجلد جديد للبدء</p>
                  </div>
                )}
              </div>
            </div>

            {/* معلومات إضافية */}
            {actions.length > 0 && (
              <div className="bg-white/20 rounded-2xl p-4 border border-black/10">
                <h4 className="text-sm font-bold text-black mb-2">التغييرات المعلقة:</h4>
                <p className="text-xs text-black/70">
                  {actions.length} تغيير(ات) سيتم تطبيقها عند الحفظ
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-black/10">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium transition-colors"
          >
            حفظ التغييرات
          </button>
        </div>
      </DialogContent>

      {/* نافذة التعديل المتقدم */}
      {folderToEdit && (
        <FolderEditModal
          isOpen={showFolderEditModal}
          onClose={() => {
            setShowFolderEditModal(false);
            setFolderToEdit(null);
          }}
          folder={folderToEdit}
          onSave={handleFolderEditSave}
        />
      )}
    </Dialog>
  );
};