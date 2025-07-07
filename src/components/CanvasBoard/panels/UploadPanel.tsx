import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Upload, File, Image, Video, FileText, X } from 'lucide-react';

interface UploadPanelProps {
  onFileUpload: (files: File[]) => void;
  maxFileSize?: number;
  allowedTypes?: string[];
}

const UploadPanel: React.FC<UploadPanelProps> = ({
  onFileUpload,
  maxFileSize = 10,
  allowedTypes = ['image/*', 'video/*', 'application/pdf', '.txt', '.doc', '.docx']
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const sizeValid = file.size <= maxFileSize * 1024 * 1024;
      const typeValid = allowedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.replace('*', ''));
        }
        return file.type === type || file.name.endsWith(type);
      });
      return sizeValid && typeValid;
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      simulateUpload(validFiles);
      onFileUpload(validFiles);
    }
  };

  const simulateUpload = (files: File[]) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev !== null && prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(null), 1000);
          return 100;
        }
        return (prev || 0) + 10;
      });
    }, 100);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm border-black/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-500" />
          رفع المرفقات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-arabic text-gray-600 mb-2">
            اسحب الملفات هنا أو انقر للاختيار
          </p>
          <Input
            type="file"
            multiple
            onChange={handleFileInput}
            accept={allowedTypes.join(',')}
            className="hidden"
            id="file-upload"
          />
          <Label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="outline" size="sm" className="font-arabic">
              اختيار الملفات
            </Button>
          </Label>
        </div>

        {uploadProgress !== null && (
          <div className="space-y-2">
            <Label className="text-xs font-arabic">جاري الرفع...</Label>
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-xs text-gray-600 font-arabic">{uploadProgress}%</p>
          </div>
        )}

        <Separator />

        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">الملفات المرفوعة</h4>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {uploadedFiles.length === 0 ? (
              <p className="text-xs text-gray-500 font-arabic text-center py-4">
                لا توجد ملفات مرفوعة
              </p>
            ) : (
              uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="font-arabic truncate">{file.name}</p>
                      <p className="text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeFile(index)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-1">قيود الرفع:</h4>
          <ul className="text-xs text-blue-800 font-arabic space-y-1">
            <li>• الحد الأقصى للملف: {maxFileSize} ميجابايت</li>
            <li>• الأنواع المدعومة: صور، فيديو، PDF، نصوص</li>
            <li>• يمكن رفع عدة ملفات معاً</li>
            <li>• اسحب وأفلت للرفع السريع</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => setUploadedFiles([])} 
            size="sm" 
            variant="outline" 
            className="text-xs font-arabic"
            disabled={uploadedFiles.length === 0}
          >
            مسح الكل
          </Button>
          <Button 
            onClick={() => console.log('إدراج في الكانفس')} 
            size="sm" 
            className="text-xs font-arabic"
            disabled={uploadedFiles.length === 0}
          >
            إدراج في الكانفس
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadPanel;