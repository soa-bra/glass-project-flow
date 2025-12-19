import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Image, FileText, File, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useCanvasStore } from '@/stores/canvasStore';
import type { DocumentStatus } from '@/types/canvas-elements';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  preview?: string;
  category: 'image' | 'document' | 'other';
}

type FileFilter = 'all' | 'images' | 'documents';

const getFileCategory = (mimeType: string): UploadedFile['category'] => {
  if (mimeType.startsWith('image/')) return 'image';
  if (
    mimeType === 'application/pdf' ||
    mimeType.includes('word') ||
    mimeType.includes('document') ||
    mimeType === 'text/plain'
  ) return 'document';
  return 'other';
};

export default function FileUploadPanel() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [filter, setFilter] = useState<FileFilter>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addElement, setActiveTool } = useCanvasStore();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  }, []);

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      category: getFileCategory(file.type)
    }));

    setFiles(prev => [...prev, ...newFiles]);
    toast.success(`تم رفع ${newFiles.length} ملف`);
  };

  const removeFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const insertFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    if (file.category === 'image') {
      // إدراج كصورة
      const imageUrl = URL.createObjectURL(file.file);
      addElement({
        type: 'image',
        position: { x: 100, y: 100 },
        size: { width: 300, height: 200 },
        src: imageUrl,
        alt: file.name
      });
      toast.success(`تم إدراج الصورة: ${file.name}`);
    } else if (file.category === 'document') {
      // إدراج كمستند حي
      const docUrl = URL.createObjectURL(file.file);
      addElement({
        type: 'document',
        position: { x: 100, y: 100 },
        size: { width: 280, height: 200 },
        documentData: {
          id: file.id,
          name: file.name,
          mimeType: file.type,
          size: file.size,
          url: docUrl,
          status: 'draft' as DocumentStatus,
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
      toast.success(`تم إدراج المستند: ${file.name}`);
    } else {
      // إدراج كملف عادي
      addElement({
        type: 'file',
        position: { x: 100, y: 100 },
        size: { width: 250, height: 120 },
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: URL.createObjectURL(file.file)
      });
      toast.success(`تم إدراج الملف: ${file.name}`);
    }

    // إزالة الملف بعد الإدراج
    removeFile(fileId);
  };

  const handleActivateUploader = () => {
    setActiveTool('file_uploader');
    toast.info('انقر على الكانفاس أو اسحب ملفاً عليه لإدراجه');
  };

  const filteredFiles = files.filter(f => {
    if (filter === 'all') return true;
    if (filter === 'images') return f.category === 'image';
    if (filter === 'documents') return f.category === 'document';
    return true;
  });

  const imageCount = files.filter(f => f.category === 'image').length;
  const docCount = files.filter(f => f.category === 'document').length;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          رفع الملفات
        </h4>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-[18px] p-6 text-center transition-colors cursor-pointer
            ${isDragging 
              ? 'border-[hsl(var(--accent-green))] bg-[rgba(61,190,139,0.05)]' 
              : 'border-[#DADCE0] bg-[hsl(var(--panel))] hover:bg-[rgba(217,231,237,0.8)]'
            }
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <Upload size={24} className="text-[hsl(var(--ink-60))]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[hsl(var(--ink))] mb-0.5">
                اسحب الملفات هنا
              </p>
              <p className="text-[10px] text-[hsl(var(--ink-60))]">
                أو انقر لاختيار الملفات
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        {files.length > 0 && (
          <div className="flex items-center gap-1 mb-3 p-1 bg-white rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition-colors
                ${filter === 'all' 
                  ? 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))]' 
                  : 'text-[hsl(var(--ink-60))] hover:bg-[hsl(var(--panel))]/50'
                }`}
            >
              الكل ({files.length})
            </button>
            <button
              onClick={() => setFilter('images')}
              className={`flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition-colors
                ${filter === 'images' 
                  ? 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))]' 
                  : 'text-[hsl(var(--ink-60))] hover:bg-[hsl(var(--panel))]/50'
                }`}
            >
              <span className="flex items-center justify-center gap-1">
                <Image size={12} />
                صور ({imageCount})
              </span>
            </button>
            <button
              onClick={() => setFilter('documents')}
              className={`flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition-colors
                ${filter === 'documents' 
                  ? 'bg-[hsl(var(--panel))] text-[hsl(var(--ink))]' 
                  : 'text-[hsl(var(--ink-60))] hover:bg-[hsl(var(--panel))]/50'
                }`}
            >
              <span className="flex items-center justify-center gap-1">
                <FileText size={12} />
                مستندات ({docCount})
              </span>
            </button>
          </div>
        )}

        {/* Uploaded Files List */}
        {filteredFiles.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-[12px] font-semibold text-[hsl(var(--ink))]">
                الملفات ({filteredFiles.length})
              </h5>
              <button
                onClick={() => {
                  files.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
                  setFiles([]);
                }}
                className="text-[10px] text-[hsl(var(--accent-red))] hover:underline"
              >
                مسح الكل
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="group bg-[hsl(var(--panel))] rounded-lg p-2 hover:bg-[rgba(217,231,237,0.8)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {/* Preview or Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-white flex items-center justify-center">
                      {file.preview ? (
                        <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                      ) : file.category === 'image' ? (
                        <Image size={16} className="text-[hsl(var(--accent-blue))]" />
                      ) : file.category === 'document' ? (
                        <FileText size={16} className="text-[hsl(var(--accent-red))]" />
                      ) : (
                        <File size={16} className="text-[hsl(var(--ink-60))]" />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[hsl(var(--ink))] truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[9px] text-[hsl(var(--ink-60))]">
                          {formatFileSize(file.size)}
                        </p>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium
                          ${file.category === 'image' 
                            ? 'bg-[rgba(61,168,245,0.15)] text-[hsl(var(--accent-blue))]'
                            : file.category === 'document'
                            ? 'bg-[rgba(229,86,77,0.15)] text-[hsl(var(--accent-red))]'
                            : 'bg-[hsl(var(--panel))] text-[hsl(var(--ink-60))]'
                          }`}>
                          {file.category === 'image' ? 'صورة' : file.category === 'document' ? 'مستند' : 'ملف'}
                        </span>
                      </div>
                    </div>

                    {/* Insert Button */}
                    <button
                      onClick={() => insertFile(file.id)}
                      className="flex-shrink-0 px-2 py-1 bg-[hsl(var(--accent-green))] text-white text-[10px] font-medium rounded hover:bg-[hsl(var(--accent-green))]/90 transition-colors"
                    >
                      إدراج
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-all"
                    >
                      <X size={14} className="text-[hsl(var(--accent-red))]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activate Button */}
        <button
          onClick={handleActivateUploader}
          className="w-full mt-4 py-2.5 bg-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/90 text-white rounded-lg transition-colors text-[13px] font-medium"
        >
          تفعيل أداة رفع الملفات
        </button>
      </div>

      {/* Info */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <h5 className="text-[12px] font-semibold text-[hsl(var(--ink-60))] mb-2">
          الصيغ المدعومة
        </h5>
        <div className="space-y-1">
          <p className="text-[10px] text-[hsl(var(--ink-60))] leading-relaxed">
            <strong>الصور:</strong> JPG, PNG, GIF, SVG, WebP
          </p>
          <p className="text-[10px] text-[hsl(var(--ink-60))] leading-relaxed">
            <strong>المستندات:</strong> PDF, DOC, DOCX, TXT
          </p>
          <p className="text-[10px] text-[hsl(var(--ink-60))] leading-relaxed">
            <strong>أخرى:</strong> CSV, JSON, XLS, XLSX
          </p>
        </div>
      </div>
    </div>
  );
}
