import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, FileText, File } from 'lucide-react';

interface UploadPanelProps {
  onFileUpload: (files: File[]) => void;
}

const UploadPanel: React.FC<UploadPanelProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload size={16} />
          رفع الملفات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          className="hidden"
        />
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={handleFileSelect}
            className="h-20 flex-col"
          >
            <Image size={24} />
            <span className="text-xs mt-1">صور</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleFileSelect}
            className="h-20 flex-col"
          >
            <FileText size={24} />
            <span className="text-xs mt-1">مستندات</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleFileSelect}
            className="h-20 flex-col col-span-2"
          >
            <File size={24} />
            <span className="text-xs mt-1">جميع الملفات</span>
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          أنواع الملفات المدعومة: JPG, PNG, PDF, DOC, TXT
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadPanel;