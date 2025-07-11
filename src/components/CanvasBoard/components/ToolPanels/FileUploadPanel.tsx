import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, File, Image, Trash2, Download, 
  Sparkles, FileText, Music, Video, Archive
} from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadPanelProps {
  onFileUpload: (files: UploadedFile[]) => void;
  onFileInsert: (file: UploadedFile, mode: 'normal' | 'smart') => void;
  isHost: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnail?: string;
  uploadedAt: Date;
}

const fileTypeIcons = {
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
  archive: Archive,
  other: File
};

const getFileType = (mimeType: string): keyof typeof fileTypeIcons => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
  return 'other';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileUploadPanel: React.FC<FileUploadPanelProps> = ({
  onFileUpload,
  onFileInsert,
  isHost
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [lastUploadedFile, setLastUploadedFile] = useState<UploadedFile | null>(null);

  const handleFileUpload = useCallback((files: FileList) => {
    if (!isHost) {
      toast.error('يتطلب صلاحية المضيف لرفع الملفات');
      return;
    }

    const newFiles: UploadedFile[] = [];
    
    Array.from(files).forEach((file) => {
      const fileId = Math.random().toString(36).substr(2, 9);
      const fileUrl = URL.createObjectURL(file);
      
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        uploadedAt: new Date()
      };

      // إنشاء thumbnail للصور
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxSize = 100;
          
          let { width, height } = img;
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          uploadedFile.thumbnail = canvas.toDataURL();
          setUploadedFiles(prev => 
            prev.map(f => f.id === fileId ? uploadedFile : f)
          );
        };
        img.src = fileUrl;
      }

      newFiles.push(uploadedFile);
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setLastUploadedFile(newFiles[newFiles.length - 1]);
    onFileUpload(newFiles);
    
    toast.success(`تم رفع ${newFiles.length} ملف بنجاح`);
  }, [isHost, onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        handleFileUpload(target.files);
      }
    };
    
    input.click();
  }, [handleFileUpload]);

  const handleDeleteFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success('تم حذف الملف');
  }, []);

  const handleInsertFile = useCallback((file: UploadedFile, mode: 'normal' | 'smart') => {
    onFileInsert(file, mode);
    toast.success(`تم إدراج الملف بوضع ${mode === 'smart' ? 'ذكي' : 'عادي'}`);
  }, [onFileInsert]);

  const reuploadLastFile = useCallback(() => {
    if (lastUploadedFile) {
      toast.info('إعادة رفع آخر ملف...');
    }
  }, [lastUploadedFile]);

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-lg shadow-lg border max-h-[600px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-arabic">أداة رفع المرفقات</CardTitle>
        {!isHost && (
          <Badge variant="secondary" className="text-xs w-fit">
            المضيف فقط
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4 overflow-y-auto max-h-[500px]">
        {/* منطقة السحب والإفلات */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-all
            ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'}
            ${!isHost ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400 hover:bg-blue-50'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={isHost ? handleFileSelect : undefined}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <div className="text-sm text-gray-600">
            {isHost ? (
              <>
                <p>اسحب الملفات هنا أو انقر للاختيار</p>
                <p className="text-xs text-gray-400 mt-1">
                  يدعم جميع أنواع الملفات
                </p>
              </>
            ) : (
              <p>يتطلب صلاحية المضيف</p>
            )}
          </div>
        </div>

        {isHost && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleFileSelect}
            className="w-full text-xs"
          >
            اختيار ملفات من الجهاز
          </Button>
        )}

        {uploadedFiles.length > 0 && (
          <>
            <Separator />
            
            {/* قائمة الملفات */}
            <div>
              <div className="text-xs font-medium text-gray-700 mb-2">
                الملفات المرفوعة ({uploadedFiles.length})
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {uploadedFiles.map((file) => {
                  const FileIcon = fileTypeIcons[getFileType(file.type)];
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 p-2 border rounded-lg bg-white"
                    >
                      {/* معاينة أو أيقونة */}
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {file.thumbnail ? (
                          <img
                            src={file.thumbnail}
                            alt={file.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <FileIcon className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      
                      {/* معلومات الملف */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                      
                      {/* الإجراءات */}
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInsertFile(file, 'normal')}
                          className="p-1 h-6 w-6"
                          title="إدراج عادي (Enter)"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInsertFile(file, 'smart')}
                          className="p-1 h-6 w-6"
                          title="إدراج ذكي (Shift+Enter)"
                        >
                          <Sparkles className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                          title="حذف (Delete)"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* الاختصارات */}
        <div className="text-xs text-gray-500 space-y-1">
          <div><strong>U:</strong> فتح نافذة الرفع</div>
          <div><strong>Ctrl+U:</strong> إعادة رفع آخر ملف</div>
          <div><strong>Enter:</strong> إدراج الملف المحدد</div>
          <div><strong>Shift+Enter:</strong> إدراج ذكي</div>
          <div><strong>Delete:</strong> حذف المرفق المحدد</div>
        </div>
      </CardContent>
    </Card>
  );
};