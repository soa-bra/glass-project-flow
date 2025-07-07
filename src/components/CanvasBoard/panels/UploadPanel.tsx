import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, File, Image, FileText, Paperclip, Download, Trash2, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadDate: Date;
  thumbnail?: string;
}

interface UploadPanelProps {
  onFileUpload: (file: File) => void;
  onFileSelect: (file: UploadedFile) => void;
  onFileDelete: (fileId: string) => void;
  onSendToAI: (file: UploadedFile) => void;
  canUpload?: boolean;
}

const UploadPanel: React.FC<UploadPanelProps> = ({
  onFileUpload,
  onFileSelect,
  onFileDelete,
  onSendToAI,
  canUpload = true
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'عرض تقديمي.pptx',
      type: 'presentation',
      size: 2048000,
      url: '/files/presentation.pptx',
      uploadDate: new Date('2024-01-15'),
      thumbnail: '/thumbs/presentation.jpg'
    },
    {
      id: '2',
      name: 'تقرير مالي.pdf',
      type: 'pdf',
      size: 1024000,
      url: '/files/report.pdf',
      uploadDate: new Date('2024-01-14')
    },
    {
      id: '3',
      name: 'شعار الشركة.svg',
      type: 'image',
      size: 512000,
      url: '/files/logo.svg',
      uploadDate: new Date('2024-01-13'),
      thumbnail: '/thumbs/logo.svg'
    }
  ]);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = uploadedFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!canUpload) {
      toast.error('ليس لديك صلاحية لرفع الملفات');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // محاكاة رفع الملف
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // إضافة الملف للقائمة
          const newFile: UploadedFile = {
            id: Date.now().toString(),
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : 'document',
            size: file.size,
            url: URL.createObjectURL(file),
            uploadDate: new Date()
          };
          
          setUploadedFiles(prev => [newFile, ...prev]);
          onFileUpload(file);
          toast.success('تم رفع الملف بنجاح');
          
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'pdf': return FileText;
      case 'presentation': return File;
      default: return File;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      const input = document.createElement('input');
      input.type = 'file';
      const fileList = new DataTransfer();
      fileList.items.add(files[0]);
      input.files = fileList.files;
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(event, 'target', { value: input });
      handleFileChange(event as any);
    }
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm border-black/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <Upload className="w-5 h-5 text-indigo-500" />
          رفع المرفقات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* منطقة الرفع */}
        {canUpload && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer"
            onClick={handleFileSelect}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-arabic mb-1">
              اسحب الملفات هنا أو انقر للاختيار
            </p>
            <p className="text-xs text-gray-500 font-arabic">
              يدعم جميع أنواع الملفات
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="*/*"
            />
          </div>
        )}

        {/* شريط التقدم */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-arabic">
              <span>جاري الرفع...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* البحث في الملفات */}
        <div>
          <Input
            placeholder="البحث في الملفات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="font-arabic"
          />
        </div>

        {/* قائمة الملفات المرفوعة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">
            الملفات المرفوعة ({filteredFiles.length})
          </h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredFiles.map((file) => {
              const IconComponent = getFileIcon(file.type);
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onFileSelect(file)}
                >
                  {file.thumbnail ? (
                    <img 
                      src={file.thumbnail} 
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-indigo-100 rounded flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-indigo-600" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium font-arabic truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 font-arabic">
                      {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString('ar')}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendToAI(file);
                      }}
                      className="h-8 w-8 p-0"
                      title="إرسال للذكاء الاصطناعي"
                    >
                      <Brain className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.url, '_blank');
                      }}
                      className="h-8 w-8 p-0"
                      title="تحميل"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    
                    {canUpload && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileDelete(file.id);
                          setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
                        }}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        title="حذف"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* تعليمات */}
        <div className="bg-indigo-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium font-arabic mb-1">إرشادات:</h4>
          <ul className="text-xs text-indigo-800 font-arabic space-y-1">
            <li>• اسحب الملفات مباشرة إلى اللوحة</li>
            <li>• انقر على الملف لإضافته للكانفس</li>
            <li>• استخدم أيقونة الدماغ لتحليل بالذكاء الاصطناعي</li>
            <li>• يمكن ربط الملفات بأي عنصر</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadPanel;