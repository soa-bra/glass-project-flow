import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { 
  X, 
  Folder, 
  FolderOpen, 
  Archive, 
  FileText, 
  Image, 
  Video,
  Music,
  File,
  Plus,
  Trash2,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FolderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
    filesCount: number;
    files?: Array<{
      id: string;
      name: string;
      type: string;
      size: number;
      uploadedAt: string;
    }>;
  };
  onSave: (updatedFolder: any) => void;
}

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

// ألوان المجلدات المتاحة
const folderColors = [
  '#a4e2f6', '#d9d2fd', '#bdeed3', '#fbe2aa', '#f1b5b9',
  '#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#ff99cc'
];

export const FolderEditModal: React.FC<FolderEditModalProps> = ({
  isOpen,
  onClose,
  folder,
  onSave
}) => {
  const { toast } = useToast();
  
  const [folderName, setFolderName] = useState(folder.name);
  const [selectedColor, setSelectedColor] = useState(folder.color || '#a4e2f6');
  const [selectedIcon, setSelectedIcon] = useState(folder.icon || 'folder');
  const [folderFiles, setFolderFiles] = useState(folder.files || []);

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

  const handleRemoveFile = (fileId: string) => {
    const file = folderFiles.find(f => f.id === fileId);
    if (file && window.confirm(`هل تريد بالتأكيد حذف الملف "${file.name}"؟`)) {
      setFolderFiles(prev => prev.filter(f => f.id !== fileId));
      toast({
        title: "تم حذف الملف",
        description: `تم حذف "${file.name}" من المجلد`,
      });
    }
  };

  const handleAddNewFile = () => {
    // محاكاة إضافة ملف جديد
    const newFile = {
      id: Date.now().toString(),
      name: 'ملف جديد.pdf',
      type: 'application/pdf',
      size: 1024 * 1024, // 1MB
      uploadedAt: new Date().toISOString()
    };
    
    setFolderFiles(prev => [...prev, newFile]);
    toast({
      title: "تم إضافة الملف",
      description: "تم إضافة ملف جديد للمجلد",
    });
  };

  const handleSave = () => {
    if (!folderName.trim()) {
      toast({
        title: "اسم المجلد مطلوب",
        description: "يرجى إدخال اسم صحيح للمجلد",
        variant: "destructive",
      });
      return;
    }

    const updatedFolder = {
      ...folder,
      name: folderName,
      color: selectedColor,
      icon: selectedIcon,
      files: folderFiles,
      filesCount: folderFiles.length
    };

    onSave(updatedFolder);
    toast({
      title: "تم حفظ التغييرات",
      description: "تم تحديث إعدادات المجلد بنجاح",
    });
  };

  const handleClose = () => {
    // إعادة تعيين القيم للحالة الأصلية
    setFolderName(folder.name);
    setSelectedColor(folder.color || '#a4e2f6');
    setSelectedIcon(folder.icon || 'folder');
    setFolderFiles(folder.files || []);
    onClose();
  };

  const SelectedIconComponent = folderIcons.find(icon => icon.id === selectedIcon)?.icon || Folder;

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
        <DialogTitle className="sr-only">تعديل إعدادات المجلد</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: selectedColor }}
            >
              <SelectedIconComponent className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">تعديل المجلد</h2>
              <p className="text-sm text-black/70">تخصيص إعدادات وملفات المجلد</p>
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
            {/* إعدادات المجلد */}
            <div className="bg-white/30 rounded-3xl p-6 border border-black/10">
              <h3 className="text-lg font-bold text-black mb-4">إعدادات المجلد</h3>
              
              <div className="space-y-6">
                {/* اسم المجلد */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-black">اسم المجلد</label>
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* أيقونة المجلد */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-black">أيقونة المجلد</label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {folderIcons.map((iconData) => {
                      const IconComponent = iconData.icon;
                      return (
                        <button
                          key={iconData.id}
                          onClick={() => setSelectedIcon(iconData.id)}
                          className={`p-3 rounded-2xl border-2 transition-all hover:scale-105 ${
                            selectedIcon === iconData.id
                              ? 'border-black bg-black/10 scale-105'
                              : 'border-black/20 bg-white/20 hover:border-black/40'
                          }`}
                          title={iconData.name}
                        >
                          <IconComponent className="w-6 h-6 text-black mx-auto" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* لون المجلد */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-black">لون المجلد</label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                    {folderColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                          selectedColor === color 
                            ? 'border-black scale-110 shadow-lg' 
                            : 'border-black/20 hover:border-black/40'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
    </Dialog>
  );
};