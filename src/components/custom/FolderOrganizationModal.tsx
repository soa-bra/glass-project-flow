import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { FolderPlus, X, Folder, Edit3, Trash2, Move, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FolderEditModal } from './FolderEditModal';

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
  
  // المجلدات الموجودة حالياً
  const [folders, setFolders] = useState<FolderData[]>([
    {
      id: '1',
      name: 'مستندات المشروع',
      filesCount: 8,
      createdAt: '2024-01-15',
      color: '#a4e2f6',
      icon: 'folder',
      files: [
        { id: '1', name: 'مواصفات المشروع.pdf', type: 'application/pdf', size: 2048000, uploadedAt: '2024-01-15T10:00:00Z' },
        { id: '2', name: 'خطة العمل.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 1024000, uploadedAt: '2024-01-16T14:30:00Z' }
      ]
    },
    {
      id: '2', 
      name: 'التصاميم',
      filesCount: 12,
      createdAt: '2024-01-18',
      color: '#d9d2fd',
      icon: 'image',
      files: [
        { id: '3', name: 'تصميم الواجهة.png', type: 'image/png', size: 5120000, uploadedAt: '2024-01-18T09:15:00Z' },
        { id: '4', name: 'الشعار.svg', type: 'image/svg+xml', size: 256000, uploadedAt: '2024-01-19T11:45:00Z' }
      ]
    },
    {
      id: '3',
      name: 'تقارير',
      filesCount: 5,
      createdAt: '2024-01-20',
      color: '#bdeed3',
      icon: 'file-text',
      files: [
        { id: '5', name: 'تقرير الأداء.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 3072000, uploadedAt: '2024-01-20T16:20:00Z' }
      ]
    }
  ]);

  const [actions, setActions] = useState<FolderAction[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#a4e2f6');
  const [showFolderEditModal, setShowFolderEditModal] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<FolderData | null>(null);

  const folderColors = [
    '#a4e2f6', '#d9d2fd', '#bdeed3', '#fbe2aa', '#f1b5b9'
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
      color: selectedColor
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
              
              <div className="space-y-3">
                {folders.map((folder) => (
                  <div key={folder.id} className="flex items-center gap-4 p-4 bg-white/20 rounded-2xl border border-black/10">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: folder.color }}
                    >
                      <Folder className="w-5 h-5 text-black" />
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
                          <h4 className="font-medium text-black">{folder.name}</h4>
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
                          className="p-2 bg-white/30 hover:bg-white/40 rounded-xl transition-colors"
                          title="تعديل متقدم"
                        >
                          <Edit3 className="w-4 h-4 text-black" />
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
                ))}
                
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