import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  MousePointer2, 
  Pen, 
  ZoomIn, 
  Hand, 
  Upload, 
  MessageSquare, 
  Type, 
  Square, 
  Plus,
  Minus
} from 'lucide-react';

interface MiroStyleMainToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

const mainTools = [
  { 
    id: 'select', 
    icon: MousePointer2, 
    label: 'أداة التحديد',
    description: 'التحديد عبر النقر أو النقر المطول والسحب'
  },
  { 
    id: 'smart-pen', 
    icon: Pen, 
    label: 'القلم الذكي',
    description: 'رسم ذكي مع تحويل الأشكال والربط'
  },
  { 
    id: 'zoom', 
    icon: ZoomIn, 
    label: 'أداة الزوم',
    description: 'التكبير والتصغير'
  },
  { 
    id: 'hand', 
    icon: Hand, 
    label: 'أداة الكف',
    description: 'التنقل عبر النقر والسحب'
  },
  { 
    id: 'upload', 
    icon: Upload, 
    label: 'رفع مرفق',
    description: 'رفع الملفات والمرفقات'
  },
  { 
    id: 'comment', 
    icon: MessageSquare, 
    label: 'إضافة تعليق',
    description: 'إضافة ملاحظات نصية وصوتية'
  },
  { 
    id: 'text', 
    icon: Type, 
    label: 'إضافة نص',
    description: 'إضافة نصوص ومربعات نص'
  },
  { 
    id: 'shape', 
    icon: Square, 
    label: 'إضافة شكل',
    description: 'أشكال هندسية وأيقونات وملاحظات لاصقة'
  },
  { 
    id: 'smart-element', 
    icon: Plus, 
    label: 'عنصر ذكي',
    description: 'عناصر ذكية متقدمة ومتفاعلة'
  }
];

export const MiroStyleMainToolbar: React.FC<MiroStyleMainToolbarProps> = ({
  selectedTool,
  onToolSelect
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {mainTools.map((tool, index) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.id;
            
            return (
              <React.Fragment key={tool.id}>
                {/* Separators */}
                {(index === 4 || index === 6) && (
                  <div className="h-8 w-px bg-gray-200 mx-1" />
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-12 h-12 p-0 hover:bg-blue-50 relative group rounded-xl",
                    isSelected && "bg-blue-100 border border-blue-300"
                  )}
                  onClick={() => onToolSelect(tool.id)}
                  title={tool.label}
                >
                  <Icon 
                    className={cn(
                      "w-5 h-5",
                      isSelected ? "text-blue-600" : "text-gray-600"
                    )} 
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                                px-3 py-2 bg-gray-900 text-white text-xs rounded-lg
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                                pointer-events-none whitespace-nowrap z-50">
                    <div className="font-medium">{tool.label}</div>
                    <div className="text-gray-300 text-xs mt-1">{tool.description}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                                  border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </Button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};