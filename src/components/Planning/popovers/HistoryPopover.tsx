import React from 'react';
import { Clock, RotateCcw } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';

interface HistoryPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryPopover: React.FC<HistoryPopoverProps> = ({ isOpen, onClose }) => {
  const { history, undo } = useCanvasStore();
  
  if (!isOpen) return null;
  
  // Mock history data for now
  const historyItems = [
    { id: 1, action: 'إضافة عنصر', timestamp: Date.now() - 60000, icon: '➕' },
    { id: 2, action: 'تحريك عنصر', timestamp: Date.now() - 120000, icon: '↔️' },
    { id: 3, action: 'تغيير لون', timestamp: Date.now() - 180000, icon: '🎨' },
    { id: 4, action: 'حذف عنصر', timestamp: Date.now() - 240000, icon: '🗑️' },
    { id: 5, action: 'نسخ عنصر', timestamp: Date.now() - 300000, icon: '📋' },
  ];
  
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    return `منذ ${hours} ساعة`;
  };
  
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border p-4 z-50 max-h-96 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-sb-ink-40" />
          <h3 className="text-[14px] font-semibold text-sb-ink">سجل العمليات</h3>
        </div>
        
        <div className="space-y-2">
          {historyItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                // Jump to this point in history
                for (let i = 0; i < index; i++) {
                  undo();
                }
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-sb-panel-bg rounded-lg transition-colors text-right"
            >
              <span className="text-[18px]">{item.icon}</span>
              <div className="flex-1">
                <p className="text-[13px] text-sb-ink">{item.action}</p>
                <p className="text-[11px] text-sb-ink-40">{formatTime(item.timestamp)}</p>
              </div>
              <RotateCcw size={14} className="text-sb-ink-40" />
            </button>
          ))}
        </div>
        
        {historyItems.length === 0 && (
          <p className="text-[12px] text-sb-ink-40 text-center py-8">
            لا توجد عمليات في السجل
          </p>
        )}
      </div>
    </>
  );
};
