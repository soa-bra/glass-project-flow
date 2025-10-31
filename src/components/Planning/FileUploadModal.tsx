import React, { useState, useCallback } from 'react';
import { X, Upload, FileText, Image as ImageIcon, FileType } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlanningStore } from '@/stores/planningStore';
import { useToast } from '@/hooks/use-toast';

const FileUploadModal = ({ onClose }: { onClose: () => void }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const { createBoard } = usePlanningStore();
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // التحقق من نوع الملف
    const allowedTypes = ['text/plain', 'application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'نوع ملف غير مدعوم',
        description: 'الرجاء رفع ملف نصي أو PDF أو صورة',
        variant: 'destructive',
      });
      return;
    }

    // التحقق من حجم الملف (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: 'الملف كبير جداً',
        description: 'الحد الأقصى لحجم الملف هو 20 ميجابايت',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    // محاكاة رفع الملف وتحليله
    setTimeout(() => {
      setUploadedFile({
        name: file.name,
        type: file.type,
        size: file.size,
      });
      setUploading(false);
      
      toast({
        title: 'تم رفع الملف بنجاح',
        description: 'جاري تحليل محتوى الملف...',
      });
    }, 2000);
  };

  const handleCreateFromFile = () => {
    if (uploadedFile) {
      createBoard('from_file', {
        name: `${uploadedFile.name} - لوحة`,
        sourceFile: uploadedFile,
      });
      onClose();
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon size={32} />;
    if (type === 'application/pdf') return <FileType size={32} />;
    return <FileText size={32} />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[18px] w-[600px] overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.10)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
            <h2 className="text-[24px] font-bold text-[hsl(var(--ink))]">
              رفع ملف
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[hsl(var(--panel))] rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Upload Area */}
          <div className="p-6">
            {!uploadedFile ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-[18px] p-12 text-center transition-colors ${
                  dragActive
                    ? 'border-[hsl(var(--accent-green))] bg-[hsl(var(--accent-green))]/5'
                    : 'border-[hsl(var(--border))] hover:border-[hsl(var(--ink-30))]'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileInput}
                  accept=".txt,.pdf,.png,.jpg,.jpeg"
                  className="hidden"
                />
                
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[hsl(var(--panel))] flex items-center justify-center">
                    <Upload size={32} className="text-[hsl(var(--ink))]" />
                  </div>
                  
                  <div>
                    <p className="text-[16px] font-semibold text-[hsl(var(--ink))] mb-2">
                      اسحب الملف هنا أو اضغط للاختيار
                    </p>
                    <p className="text-[12px] text-[hsl(var(--ink-60))]">
                      الأنواع المدعومة: نص، PDF، صورة (حتى 20 ميجابايت)
                    </p>
                  </div>
                </label>

                {uploading && (
                  <div className="absolute inset-0 bg-white/90 rounded-[18px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-[hsl(var(--accent-green))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-[14px] text-[hsl(var(--ink))]">جاري الرفع...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[hsl(var(--panel))] rounded-[18px]">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    {getFileIcon(uploadedFile.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-[hsl(var(--ink))]">
                      {uploadedFile.name}
                    </p>
                    <p className="text-[12px] text-[hsl(var(--ink-60))]">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>

                <p className="text-[13px] text-[hsl(var(--ink-60))] text-center">
                  سيقوم النظام بتحليل محتوى الملف وإنشاء لوحة تحتوي على المكونات الأنسب
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="flex-1 px-4 py-3 rounded-[18px] bg-[hsl(var(--panel))] text-[hsl(var(--ink))] font-medium hover:bg-[hsl(var(--ink-30))] transition-colors"
                  >
                    رفع ملف آخر
                  </button>
                  <button
                    onClick={handleCreateFromFile}
                    className="flex-1 px-4 py-3 rounded-[18px] bg-[hsl(var(--accent-green))] text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    إنشاء اللوحة
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FileUploadModal;
