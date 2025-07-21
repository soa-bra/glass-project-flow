import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, FileText, Film, Music, Archive, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from 'sonner';

interface UploadToolPanelProps {
  onFileUpload: (files: File[]) => void;
}

export const UploadToolPanel: React.FC<UploadToolPanelProps> = ({
  onFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    uploads,
    isProcessing,
    uploadFiles,
    removeUpload,
    clearUploads
  } = useFileUpload({
    maxFileSize: 50 * 1024 * 1024, // 50MB
    chunkSize: 5 * 1024 * 1024, // 5MB chunks
    enableWorker: true
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      try {
        const processedFiles = await uploadFiles(files, (overall, fileProgress) => {
          toast.loading(`معالجة الملفات... ${overall.toFixed(1)}%`);
        });
        
        onFileUpload(files);
        toast.success(`تم رفع ${processedFiles.length} ملف بنجاح`);
      } catch (error) {
        toast.error('فشل في رفع الملفات');
      }
    }
    
    // مسح قيمة input لإمكانية رفع نفس الملف مرة أخرى
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      try {
        const processedFiles = await uploadFiles(files, (overall, fileProgress) => {
          toast.loading(`معالجة الملفات... ${overall.toFixed(1)}%`);
        });
        
        onFileUpload(files);
        toast.success(`تم رفع ${processedFiles.length} ملف بنجاح`);
      } catch (error) {
        toast.error('فشل في رفع الملفات');
      }
    }
  };

  const supportedTypes = [
    { icon: Image, label: 'الصور', types: 'PNG, JPG, SVG, WebP' },
    { icon: FileText, label: 'المستندات', types: 'PDF, DOC, TXT' },
    { icon: Film, label: 'الفيديو', types: 'MP4, WebM, MOV' },
    { icon: Music, label: 'الصوت', types: 'MP3, WAV, OGG' },
    { icon: Archive, label: 'الأرشيف', types: 'ZIP, RAR' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-arabic flex items-center gap-2">
            <Upload className="w-4 h-4" />
            رفع الملفات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium mb-1">اسحب الملفات هنا أو اضغط للاختيار</p>
            <p className="text-xs text-muted-foreground">يدعم جميع أنواع الملفات الشائعة</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          />

          <Button 
            onClick={handleUploadClick}
            className="w-full"
            disabled={isProcessing}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isProcessing ? 'جاري المعالجة...' : 'اختيار ملفات'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-arabic">الأنواع المدعومة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {supportedTypes.map((type, index) => (
              <div key={index} className="flex items-center gap-3">
                <type.icon className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{type.label}</p>
                  <p className="text-xs text-muted-foreground">{type.types}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* قائمة الملفات المرفوعة */}
      {uploads.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-arabic">الملفات المرفوعة</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearUploads}
              className="h-6 px-2"
            >
              مسح الكل
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploads.map((upload) => (
              <div key={upload.id} className="border rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {upload.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                    {upload.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    {(upload.status === 'uploading' || upload.status === 'processing') && (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent flex-shrink-0" />
                    )}
                    <span className="text-sm font-arabic truncate">{upload.file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUpload(upload.id)}
                    className="h-6 w-6 p-0 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                
                {upload.status !== 'completed' && upload.status !== 'error' && (
                  <Progress value={upload.progress} className="h-1" />
                )}
                
                {upload.error && (
                  <p className="text-xs text-red-500">{upload.error}</p>
                )}
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{(upload.file.size / 1024 / 1024).toFixed(1)} MB</span>
                  <span className="font-arabic">
                    {upload.status === 'completed' && 'مكتمل'}
                    {upload.status === 'uploading' && 'جاري الرفع'}
                    {upload.status === 'processing' && 'جاري المعالجة'}
                    {upload.status === 'error' && 'خطأ'}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-arabic">إرشادات الرفع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• الحد الأقصى لحجم الملف: 50 ميجابايت</p>
            <p>• يمكن رفع عدة ملفات في نفس الوقت</p>
            <p>• الصور ستظهر مباشرة على اللوحة</p>
            <p>• الملفات الأخرى ستظهر كأيقونات قابلة للنقر</p>
            <p>• الملفات الكبيرة تُقطع لتحسين الأداء</p>
            <p>• معالجة الملفات تتم في الخلفية</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};