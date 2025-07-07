import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Undo, Redo, RotateCcw, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface HistoryEntry {
  id: string;
  action: string;
  timestamp: Date;
  description: string;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  currentIndex: number;
  onUndo: () => void;
  onRedo: () => void;
  onRevertTo: (index: number) => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  currentIndex,
  onUndo,
  onRedo,
  onRevertTo,
  canUndo,
  canRedo
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'add': return '➕';
      case 'delete': return '🗑️';
      case 'move': return '🔀';
      case 'edit': return '✏️';
      case 'style': return '🎨';
      default: return '📝';
    }
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <History className="w-5 h-5" />
          سجل العمليات
        </CardTitle>
        
        {/* أزرار التراجع والإعادة */}
        <div className="flex gap-2 mt-2">
          <Button
            onClick={onUndo}
            disabled={!canUndo}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <Undo className="w-4 h-4 mr-1" />
            تراجع
          </Button>
          <Button
            onClick={onRedo}
            disabled={!canRedo}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <Redo className="w-4 h-4 mr-1" />
            إعادة
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 font-arabic py-8">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              لا توجد عمليات في السجل
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-1">
              {history.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    index === currentIndex
                      ? 'bg-black text-white border-black'
                      : index < currentIndex
                      ? 'bg-green-50 border-green-200 hover:bg-green-100'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 opacity-60'
                  }`}
                  onClick={() => {
                    if (index !== currentIndex) {
                      onRevertTo(index);
                      toast.success(`تم الرجوع إلى: ${entry.description}`);
                    }
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">
                      {getActionIcon(entry.action)}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-arabic font-medium">
                        {entry.description}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {formatTime(entry.timestamp)}
                      </div>
                    </div>
                    {index === currentIndex && (
                      <div className="text-xs bg-white/20 px-2 py-1 rounded">
                        حالي
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* معلومات إحصائية */}
        {history.length > 0 && (
          <div className="border-t pt-3 mt-4">
            <div className="text-xs text-gray-500 font-arabic space-y-1">
              <div className="flex justify-between">
                <span>إجمالي العمليات:</span>
                <span>{history.length}</span>
              </div>
              <div className="flex justify-between">
                <span>الموضع الحالي:</span>
                <span>{currentIndex + 1}</span>
              </div>
              <div className="flex justify-between">
                <span>العمليات المتاحة للتراجع:</span>
                <span>{currentIndex}</span>
              </div>
              <div className="flex justify-between">
                <span>العمليات المتاحة للإعادة:</span>
                <span>{history.length - currentIndex - 1}</span>
              </div>
            </div>
          </div>
        )}

        {/* إرشادات */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <h4 className="text-sm font-medium font-arabic mb-1">💡 إرشادات:</h4>
          <ul className="text-xs font-arabic text-blue-800 space-y-1">
            <li>• انقر على أي عملية للرجوع إليها</li>
            <li>• استخدم Ctrl+Z للتراجع</li>
            <li>• استخدم Ctrl+Y للإعادة</li>
            <li>• العمليات الرمادية في المستقبل</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};