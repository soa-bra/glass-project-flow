import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Plus } from 'lucide-react';

export const TemplateUploader: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm font-medium mb-2">اسحب الملفات هنا أو</p>
        <Button className="gap-1">
          <Plus className="w-4 h-4" />
          اختر الملفات
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        <div className="p-2 bg-white/20 rounded">
          <FileText className="w-4 h-4 mx-auto mb-1" />
          <p>مستندات</p>
        </div>
        <div className="p-2 bg-white/20 rounded">
          <FileText className="w-4 h-4 mx-auto mb-1" />
          <p>قوالب</p>
        </div>
        <div className="p-2 bg-white/20 rounded">
          <FileText className="w-4 h-4 mx-auto mb-1" />
          <p>نماذج</p>
        </div>
      </div>
    </div>
  );
};