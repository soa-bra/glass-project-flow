import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, File, Image, X, Check, AlertCircle, Download } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
  insertMode: 'direct' | 'smart-convert';
}

interface FileUploadProps {
  onFileUpload?: (files: UploadedFile[]) => void;
  onFileInsert?: (fileId: string, mode: 'direct' | 'smart-convert') => void;
  allowedTypes?: string[];
  maxFileSize?: number; // in MB
  maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  onFileInsert,
  allowedTypes = ['image/*', 'application/pdf', '.txt', '.docx', '.xlsx'],
  maxFileSize = 10,
  maxFiles = 10
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `حجم الملف كبير جداً. الحد الأقصى ${maxFileSize} ميجابايت`;
    }

    // Check file type (basic validation)
    const isAllowed = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      if (type.includes('/*')) {
        const mainType = type.split('/')[0];
        return file.type.startsWith(mainType);
      }
      return file.type === type;
    });

    if (!isAllowed) {
      return 'نوع الملف غير مدعوم';
    }

    return null;
  };

  const createFilePreview = async (file: File): Promise<string | undefined> => {
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    }
    return undefined;
  };

  const processFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Check max files limit
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      alert(`لا يمكن رفع أكثر من ${maxFiles} ملفات`);
      return;
    }

    const newFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      
      const uploadedFile: UploadedFile = {
        id: `file_${Date.now()}_${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: error ? 'error' : 'uploading',
        progress: error ? 0 : 0,
        error,
        insertMode: 'direct',
        preview: undefined
      };

      // Create preview for images
      if (!error && file.type.startsWith('image/')) {
        uploadedFile.preview = await createFilePreview(file);
      }

      newFiles.push(uploadedFile);
    }

    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Simulate upload progress for valid files
    newFiles.forEach(file => {
      if (file.status === 'uploading') {
        simulateUpload(file.id);
      }
    });

    onFileUpload?.(newFiles);
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadedFiles(files => 
          files.map(file => 
            file.id === fileId 
              ? { ...file, status: 'completed', progress: 100 }
              : file
          )
        );
      } else {
        setUploadedFiles(files => 
          files.map(file => 
            file.id === fileId 
              ? { ...file, progress }
              : file
          )
        );
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(files => files.filter(file => file.id !== fileId));
  };

  const setInsertMode = (fileId: string, mode: 'direct' | 'smart-convert') => {
    setUploadedFiles(files => 
      files.map(file => 
        file.id === fileId ? { ...file, insertMode: mode } : file
      )
    );
  };

  const insertFile = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file && file.status === 'completed') {
      onFileInsert?.(fileId, file.insertMode);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [uploadedFiles]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={16} className="text-blue-500" />;
    return <File size={16} className="text-gray-500" />;
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragOver 
            ? "border-primary bg-primary/5" 
            : "border-sb-border hover:border-primary/50 hover:bg-sb-panel-bg/30"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto mb-4 text-sb-color-text-light" size={48} />
        <p className="text-lg font-medium mb-2">
          اسحب الملفات هنا أو انقر للاختيار
        </p>
        <p className="text-sm text-sb-color-text-light mb-4">
          الحد الأقصى: {maxFileSize} ميجابايت لكل ملف، {maxFiles} ملفات كحد أقصى
        </p>
        <p className="text-xs text-sb-color-text-light">
          أنواع الملفات المدعومة: الصور، PDF، Word، Excel، النصوص
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={(e) => e.target.files && processFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">الملفات المرفوعة ({uploadedFiles.length})</h4>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-white border border-sb-border rounded-lg"
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-sb-panel-bg/50 rounded border flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <p className="text-xs text-sb-color-text-light mb-2">
                    {formatFileSize(file.size)}
                  </p>

                  {/* Status */}
                  {file.status === 'uploading' && (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>جاري الرفع...</span>
                        <span>{Math.round(file.progress)}%</span>
                      </div>
                      <div className="w-full bg-sb-panel-bg rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {file.status === 'completed' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <Check size={12} />
                        <span>تم الرفع بنجاح</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Insert Mode Selection */}
                        <select
                          value={file.insertMode}
                          onChange={(e) => setInsertMode(file.id, e.target.value as any)}
                          className="text-xs border border-sb-border rounded px-2 py-1"
                        >
                          <option value="direct">إدراج مباشر</option>
                          <option value="smart-convert">إدراج ذكي</option>
                        </select>
                        
                        <button
                          onClick={() => insertFile(file.id)}
                          className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90"
                        >
                          إدراج
                        </button>
                      </div>
                    </div>
                  )}

                  {file.status === 'error' && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertCircle size={12} />
                      <span>{file.error}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};