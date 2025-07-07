import React from 'react';
import { Button } from '@/components/ui/button';
import { File, Download, Save, FileText, Image, FileCode } from 'lucide-react';

interface FileToolProps {
  selectedTool: string;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const FileTool: React.FC<FileToolProps> = ({ 
  selectedTool, 
  onSave,
  onExport,
  onImport
}) => {
  if (selectedTool !== 'file') return null;

  const fileTypes = [
    { id: 'png', label: 'PNG', icon: Image },
    { id: 'svg', label: 'SVG', icon: FileCode },
    { id: 'json', label: 'JSON', icon: FileText }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <File className="w-4 h-4" />
          <span className="text-sm font-medium font-arabic">إدارة الملفات</span>
        </div>
        <div className="text-sm font-arabic text-gray-600">
          حفظ وتصدير واستيراد الملفات
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium font-arabic">عمليات الملف</label>
        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={onSave}
            variant="outline"
            size="sm"
            className="text-xs font-arabic"
          >
            <Save className="w-3 h-3 mr-1" />
            حفظ المشروع
          </Button>
          <Button
            onClick={onImport}
            variant="outline"
            size="sm"
            className="text-xs font-arabic"
          >
            <File className="w-3 h-3 mr-1" />
            استيراد ملف
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium font-arabic">تصدير كـ</label>
        <div className="grid grid-cols-1 gap-2">
          {fileTypes.map(type => {
            const Icon = type.icon;
            return (
              <Button
                key={type.id}
                onClick={() => onExport()}
                variant="outline"
                size="sm"
                className="text-xs font-arabic"
              >
                <Icon className="w-3 h-3 mr-1" />
                {type.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};