import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, FileText, Video } from 'lucide-react';

interface UploadToolProps {
  selectedTool: string;
  onFileUpload: (file: File) => void;
}

export const UploadTool: React.FC<UploadToolProps> = ({ 
  selectedTool, 
  onFileUpload 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (selectedTool !== 'upload') return null;

  const handleUploadClick = (acceptType: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const uploadTypes = [
    { id: 'image', label: 'صورة', icon: Image, accept: 'image/*' },
    { id: 'document', label: 'مستند', icon: FileText, accept: '.pdf,.doc,.docx,.txt' },
    { id: 'video', label: 'فيديو', icon: Video, accept: 'video/*' }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Upload className="w-4 h-4" />
          <span className="text-sm font-medium font-arabic">رفع الملفات</span>
        </div>
        <div className="text-sm font-arabic text-gray-600">
          ارفع ملفات لإضافتها للكانفس
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium font-arabic">نوع الملف</label>
        <div className="grid grid-cols-1 gap-2">
          {uploadTypes.map(type => {
            const Icon = type.icon;
            return (
              <Button
                key={type.id}
                onClick={() => handleUploadClick(type.accept)}
                variant="outline"
                size="sm"
                className="text-xs font-arabic"
              >
                <Icon className="w-3 h-3 mr-1" />
                رفع {type.label}
              </Button>
            );
          })}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="text-xs text-gray-500 font-arabic space-y-1">
        <div>📁 الحد الأقصى: 10MB</div>
        <div>🖼️ الصور: JPG, PNG, GIF, SVG</div>
        <div>📄 المستندات: PDF, DOC, TXT</div>
      </div>
    </div>
  );
};