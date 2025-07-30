import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  FileText, 
  Music,
  Archive,
  X,
  Check,
  AlertCircle,
  Download,
  Eye,
  Trash2
} from 'lucide-react';

interface FileUploadPanelProps {
  onFileUpload: (files: File[]) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  maxFiles?: number;
}

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  preview?: string;
}

export const FileUploadPanel: React.FC<FileUploadPanelProps> = ({
  onFileUpload,
  maxFileSize = 10,
  allowedTypes = ['image/*', 'video/*', 'audio/*', 'text/*', 'application/pdf'],
  maxFiles = 10
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.startsWith('text/') || type === 'application/pdf') return FileText;
    if (type.includes('zip') || type.includes('rar')) return Archive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File) => {
    const errors = [];
    
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      errors.push(`حجم الملف أكبر من ${maxFileSize}MB`);
    }
    
    // Check file type
    const isAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });
    
    if (!isAllowed) {
      errors.push('نوع الملف غير مدعوم');
    }
    
    return errors;
  };

  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      alert(`لا يمكن رفع أكثر من ${maxFiles} ملفات`);
      return;
    }

    const validFiles = fileArray.filter(file => {
      const errors = validateFile(file);
      if (errors.length > 0) {
        alert(`خطأ في ملف ${file.name}: ${errors.join(', ')}`);
        return false;
      }
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'uploading',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(uploadFile => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, progress: 100, status: 'completed' }
              : f
          )
        );
      }, 2000);
    });

    onFileUpload(validFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const quickUploadCategories = [
    {
      name: 'صور',
      icon: Image,
      accept: 'image/*',
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'فيديو',
      icon: Video,
      accept: 'video/*',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'مستندات',
      icon: FileText,
      accept: '.pdf,.doc,.docx,.txt',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      name: 'صوت',
      icon: Music,
      accept: 'audio/*',
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          رفع الملفات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">اسحب الملفات هنا</p>
          <p className="text-xs text-muted-foreground mb-3">أو انقر للاختيار</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            اختيار ملفات
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            className="hidden"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          />
        </div>

        {/* Quick Upload Categories */}
        <div className="space-y-2">
          <label className="text-sm font-medium">رفع سريع</label>
          <div className="grid grid-cols-2 gap-2">
            {quickUploadCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = category.accept;
                    input.multiple = true;
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) handleFileSelect(files);
                    };
                    input.click();
                  }}
                  className="h-auto p-2 flex-col gap-1"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Upload Limits Info */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
          <div className="text-xs text-muted-foreground">
            <div>• الحد الأقصى للملف: {maxFileSize}MB</div>
            <div>• عدد الملفات: {uploadedFiles.length}/{maxFiles}</div>
            <div>• الأنواع المدعومة: صور، فيديو، مستندات، صوت</div>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">الملفات المرفوعة</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {uploadedFiles.map((uploadFile) => {
                const Icon = getFileIcon(uploadFile.file.type);
                return (
                  <div
                    key={uploadFile.id}
                    className="flex items-center gap-2 p-2 border rounded-lg"
                  >
                    {uploadFile.preview ? (
                      <img
                        src={uploadFile.preview}
                        alt={uploadFile.file.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                    ) : (
                      <Icon className="w-6 h-6 text-muted-foreground" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">
                        {uploadFile.file.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(uploadFile.file.size)}
                      </div>
                      
                      {uploadFile.status === 'uploading' && (
                        <Progress 
                          value={uploadFile.progress} 
                          className="h-1 mt-1"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {uploadFile.status === 'completed' && (
                        <Badge variant="secondary" className="text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          مكتمل
                        </Badge>
                      )}
                      
                      {uploadFile.status === 'error' && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          خطأ
                        </Badge>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        {uploadedFiles.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUploadedFiles([])}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              مسح الكل
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const completedFiles = uploadedFiles
                  .filter(f => f.status === 'completed')
                  .map(f => f.file);
                onFileUpload(completedFiles);
              }}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-1" />
              إضافة للوحة
            </Button>
          </div>
        )}

        {/* Tips */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div>📁 اسحب عدة ملفات مرة واحدة</div>
          <div>🖼️ معاينة الصور تلقائياً</div>
          <div>⚡ رفع سريع حسب نوع الملف</div>
        </div>
      </CardContent>
    </Card>
  );
};