import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Upload, X, FileText, Image, Video, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProjectFile } from '@/data/projectFiles';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    files: File[];
    title: string;
    linkedTasks: string[];
    projectId: string;
  }) => void;
  projectTasks?: Array<{
    id: string;
    title: string;
  }>;
  projectId: string;
}

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectTasks = [],
  projectId
}) => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [fileTitle, setFileTitle] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    
    Array.from(files).forEach((file) => {
      // التحقق من حجم الملف (مثلاً 50MB كحد أقصى)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "حجم الملف كبير جداً",
          description: `الملف ${file.name} يتجاوز الحد المسموح (50MB)`,
          variant: "destructive",
        });
        return;
      }

      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const uploadedFile: UploadedFile = {
        file,
        id: fileId,
      };

      // إنشاء معاينة للصور
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === fileId 
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadedFile);
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (fileType.startsWith('video/')) return <Video className="w-6 h-6" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSave = () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "لم يتم اختيار ملفات",
        description: "يرجى اختيار ملف واحد على الأقل للرفع",
        variant: "destructive",
      });
      return;
    }

    if (!fileTitle.trim()) {
      toast({
        title: "عنوان الملف مطلوب",
        description: "يرجى إدخال عنوان للملف",
        variant: "destructive",
      });
      return;
    }

    onSave({
      files: uploadedFiles.map(f => f.file),
      title: fileTitle,
      linkedTasks: selectedTasks,
      projectId
    });

    // إعادة تعيين النموذج
    setUploadedFiles([]);
    setFileTitle('');
    setSelectedTasks([]);
    
    toast({
      title: "تم رفع الملفات بنجاح",
      description: `تم رفع ${uploadedFiles.length} ملف(ات) للمشروع`,
    });
  };

  const handleClose = () => {
    setUploadedFiles([]);
    setFileTitle('');
    setSelectedTasks([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] p-0 overflow-hidden font-arabic"
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
          <DialogTitle className="sr-only">رفع ملف جديد</DialogTitle>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">رفع ملف جديد</h2>
              <p className="text-sm text-black/70">إضافة مستندات وملفات للمشروع</p>
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
            {/* منطقة رفع الملفات */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-black">
                الملفات <span className="text-red-500">*</span>
              </label>
              
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-colors cursor-pointer ${
                  isDragOver 
                    ? 'border-black bg-black/5' 
                    : 'border-black/20 hover:border-black/40'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-black/50 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-black mb-2">
                  اسحب الملفات هنا أو انقر للتصفح
                </h3>
                <p className="text-sm text-black/70">
                  يدعم جميع أنواع الملفات • الحد الأقصى 50MB لكل ملف
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>

              {/* قائمة الملفات المرفوعة */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-black">الملفات المحددة:</h4>
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-3 bg-white/30 rounded-2xl border border-black/10">
                      {file.preview ? (
                        <img src={file.preview} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center">
                          {getFileIcon(file.file.type)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">{file.file.name}</p>
                        <p className="text-xs text-black/70">{formatFileSize(file.file.size)}</p>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* عنوان الملف */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-black">
                عنوان الملف <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
                placeholder="أدخل عنواناً وصفياً للملف..."
                className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-2xl text-black placeholder-black/50 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* ربط المهام */}
            {projectTasks.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-black">
                  ربط بالمهام (اختياري)
                </label>
                <p className="text-xs text-black/70 mb-3">
                  يمكنك ربط هذا الملف بمهام محددة في المشروع
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {projectTasks.map((task) => (
                    <label key={task.id} className="flex items-center gap-3 p-3 bg-white/20 hover:bg-white/30 rounded-2xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => handleTaskToggle(task.id)}
                        className="w-4 h-4 text-black border-black/30 rounded focus:ring-black"
                      />
                      <span className="text-sm text-black font-medium">{task.title}</span>
                    </label>
                  ))}
                </div>
                {selectedTasks.length > 0 && (
                  <p className="text-xs text-black/70">
                    تم تحديد {selectedTasks.length} مهمة
                  </p>
                )}
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
            رفع الملفات
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
