import React from 'react';
import { Button } from '@/components/ui/button';
import { Hand, Move, RotateCcw } from 'lucide-react';

interface HandToolProps {
  selectedTool: string;
  onPan: () => void;
  onResetView: () => void;
}

export const HandTool: React.FC<HandToolProps> = ({ 
  selectedTool, 
  onPan, 
  onResetView 
}) => {
  if (selectedTool !== 'hand') return null;

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Hand className="w-4 h-4" />
          <span className="text-sm font-medium font-arabic">أداة اليد</span>
        </div>
        <div className="text-sm font-arabic text-gray-600">
          اسحب لتحريك الكانفس
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium font-arabic">إجراءات</label>
        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={onPan}
            variant="outline"
            size="sm"
            className="text-xs font-arabic"
          >
            <Move className="w-3 h-3 mr-1" />
            تفعيل التحريك
          </Button>
          <Button
            onClick={onResetView}
            variant="outline"
            size="sm"
            className="text-xs font-arabic"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            إعادة تعيين العرض
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-500 font-arabic space-y-1">
        <div>🖱️ اسحب باستخدام الماوس للتحريك</div>
        <div>⌨️ استخدم مفاتيح الأسهم للتحريك الدقيق</div>
      </div>
    </div>
  );
};