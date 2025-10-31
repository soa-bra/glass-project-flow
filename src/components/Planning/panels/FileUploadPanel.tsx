import React, { useState, useCallback } from 'react';
import { Upload, File, X, Image, FileText, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

const FileUploadPanel: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setFiles(prev => [...prev, ...newFiles]);
    toast.success(`تم رفع ${newFiles.length} ملف`);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const insertFile = (fileId: string, smart: boolean = false) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    if (smart) {
      toast.success(`تم الإدراج الذكي: ${file.name}`);
      // TODO: Implement smart insert with AI analysis
    } else {
      toast.success(`تم إدراج: ${file.name}`);
      // TODO: Implement normal insert
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-[18px] p-8 text-center transition-colors
          ${isDragging 
            ? 'border-[hsl(var(--accent-green))] bg-[rgba(61,190,139,0.05)]' 
            : 'border-[#DADCE0] bg-[hsl(var(--panel))]'
          }
        `}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <Upload size={28} className="text-[hsl(var(--ink-60))]" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-1">
              اسحب الملفات هنا
            </p>
            <p className="text-[11px] text-[hsl(var(--ink-60))]">
              أو انقر لاختيار الملفات
            </p>
          </div>
          
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))]">
              الملفات المرفوعة ({files.length})
            </h4>
            <button
              onClick={() => setFiles([])}
              className="text-[11px] text-[hsl(var(--accent-red))] hover:underline"
            >
              مسح الكل
            </button>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="group bg-[hsl(var(--panel))] rounded-[10px] p-3 hover:bg-[rgba(217,231,237,0.8)] transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Preview or Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                    {file.preview ? (
                      <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                    ) : file.type.startsWith('image/') ? (
                      <Image size={20} className="text-[hsl(var(--ink-60))]" />
                    ) : (
                      <FileText size={20} className="text-[hsl(var(--ink-60))]" />
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[hsl(var(--ink))] truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-[hsl(var(--ink-60))] mt-0.5">
                      {formatFileSize(file.size)}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() => insertFile(file.id, false)}
                        className="text-[10px] font-medium text-[hsl(var(--accent-green))] hover:underline"
                      >
                        إدراج
                      </button>
                      <span className="text-[10px] text-[hsl(var(--ink-30))]">•</span>
                      <button
                        onClick={() => insertFile(file.id, true)}
                        className="flex items-center gap-1 text-[10px] font-medium text-[hsl(var(--accent-blue))] hover:underline"
                      >
                        <Sparkles size={10} />
                        إدراج ذكي
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-all"
                  >
                    <X size={16} className="text-[hsl(var(--accent-red))]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Options */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          خيارات الإدراج
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="insert-mode" defaultChecked className="w-4 h-4" />
            <span className="text-[12px] text-[hsl(var(--ink))]">
              إدراج مباشر (كصورة أو مرفق)
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="insert-mode" className="w-4 h-4" />
            <span className="text-[12px] text-[hsl(var(--ink))]">
              ربط بمكوّن موجود
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="insert-mode" className="w-4 h-4" />
            <div>
              <span className="text-[12px] text-[hsl(var(--ink))] flex items-center gap-1">
                <Sparkles size={12} />
                إدراج ذكي (تحليل بالذكاء الصناعي)
              </span>
              <span className="text-[10px] text-[hsl(var(--ink-60))]">
                يحلل الملف ويحوله إلى عناصر ذكية
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Supported Formats */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <h4 className="text-[12px] font-semibold text-[hsl(var(--ink-60))] mb-2">
          الصيغ المدعومة
        </h4>
        <p className="text-[10px] text-[hsl(var(--ink-60))] leading-relaxed">
          الصور: JPG, PNG, GIF, SVG, WebP<br />
          المستندات: PDF, DOC, DOCX, XLS, XLSX<br />
          ملفات أخرى: TXT, CSV, JSON
        </p>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <h4 className="text-[12px] font-semibold text-[hsl(var(--ink-60))] mb-2">
          اختصارات الكيبورد
        </h4>
        <div className="space-y-1.5 text-[11px] text-[hsl(var(--ink-60))]">
          <div className="flex justify-between">
            <span>إدراج عادي</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Enter</code>
          </div>
          <div className="flex justify-between">
            <span>إدراج ذكي</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Shift+Enter</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadPanel;
