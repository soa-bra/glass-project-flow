import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, FileText, Film, Music, Archive } from 'lucide-react';

interface UploadToolPanelProps {
  onFileUpload: (files: File[]) => void;
}

export const UploadToolPanel: React.FC<UploadToolPanelProps> = ({
  onFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files);
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
          >
            <Upload className="w-4 h-4 mr-2" />
            اختيار ملفات
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};