import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Upload, File, Image, Video, FileText, X, Check } from 'lucide-react';

interface UploadPanelProps {
  onFileUpload: (files: File[]) => void;
}

const UploadPanel: React.FC<UploadPanelProps> = ({
  onFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    setUploadedFiles(prev => [...prev, ...fileArray]);
    
    // محاكاة رفع الملفات
    fileArray.forEach((file, index) => {
      const fileId = `${file.name}-${Date.now()}-${index}`;
      let progress = 0;
      
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: Math.round(progress)
        }));
      }, 200);
    });

    onFileUpload(fileArray);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (file.type.includes('text') || file.type.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-500" />
          رفع المرفقات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* منطقة الإفلات */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-arabic text-gray-600 mb-2">
            اسحب الملفات هنا أو
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="sm"
            className="text-xs font-arabic rounded-xl"
          >
            اختر الملفات
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          />
        </div>

        {/* أنواع الملفات المدعومة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">الأنواع المدعومة</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <Image className="w-3 h-3" />, label: 'صور' },
              { icon: <Video className="w-3 h-3" />, label: 'فيديو' },
              { icon: <FileText className="w-3 h-3" />, label: 'مستندات' },
              { icon: <File className="w-3 h-3" />, label: 'ملفات أخرى' }
            ].map((type, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg text-xs font-arabic"
              >
                {type.icon}
                {type.label}
              </div>
            ))}
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <>
            <Separator />
            
            {/* الملفات المرفوعة */}
            <div>
              <h4 className="text-sm font-medium font-arabic mb-2">الملفات المرفوعة</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {uploadedFiles.map((file, index) => {
                  const fileId = `${file.name}-${Date.now()}-${index}`;
                  const progress = uploadProgress[fileId] || 0;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-arabic font-medium truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </div>
                        {progress < 100 && (
                          <Progress value={progress} className="h-1 mt-1" />
                        )}
                      </div>
                      {progress === 100 ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Button
                          onClick={() => removeFile(index)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-red-100"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* إعدادات الرفع */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">إعدادات الرفع</h4>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs font-arabic rounded-xl justify-start"
            >
              <Image className="w-3 h-3 mr-2" />
              ضغط الصور تلقائياً
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs font-arabic rounded-xl justify-start"
            >
              <File className="w-3 h-3 mr-2" />
              إنشاء معاينة للملفات
            </Button>
          </div>
        </div>

        {/* نصائح الاستخدام */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <div className="text-xs text-blue-800 font-arabic space-y-1">
            <div>📁 اسحب الملفات مباشرة للكانفس</div>
            <div>🖼️ الصور تُضاف كعناصر مرئية</div>
            <div>📄 المستندات تُضاف كروابط</div>
            <div>⚡ الحد الأقصى للملف: 10 MB</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadPanel;