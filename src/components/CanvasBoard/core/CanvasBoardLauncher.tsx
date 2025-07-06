import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileText, Upload, FolderOpen } from 'lucide-react';

interface CanvasBoardLauncherProps {
  onStartCanvas: () => void;
  onOpenTemplate?: () => void;
  onUploadFile?: () => void;
  onBrowseProjects?: () => void;
}

export const CanvasBoardLauncher: React.FC<CanvasBoardLauncherProps> = ({
  onStartCanvas,
  onOpenTemplate,
  onUploadFile,
  onBrowseProjects
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-arabic text-black mb-4">ابدأ التخطيط التشاركي</h2>
        <p className="text-gray-600 font-arabic">اختر الطريقة المناسبة لبدء مشروعك</p>
      </div>
      
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 rounded-[30px]">
        <CardContent className="p-8">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="default" 
              className="h-24 rounded-[20px] bg-black text-white hover:bg-black/80 flex flex-col gap-2"
              onClick={onStartCanvas}
            >
              <Plus className="w-6 h-6" />
              <span className="font-arabic">كانفس جديدة</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 rounded-[20px] border-gray-300 hover:bg-gray-50 flex flex-col gap-2"
              onClick={onOpenTemplate}
            >
              <FileText className="w-6 h-6" />
              <span className="font-arabic">فتح قالب جاهز</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 rounded-[20px] border-gray-300 hover:bg-gray-50 flex flex-col gap-2"
              onClick={onUploadFile}
            >
              <Upload className="w-6 h-6" />
              <span className="font-arabic">تحميل ملف وتحليله</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 rounded-[20px] border-gray-300 hover:bg-gray-50 flex flex-col gap-2"
              onClick={onBrowseProjects}
            >
              <FolderOpen className="w-6 h-6" />
              <span className="font-arabic">استعراض المشاريع</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};