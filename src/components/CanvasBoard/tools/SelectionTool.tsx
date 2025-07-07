import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MousePointer, Copy, Scissors, Clipboard, Trash2, Group, Ungroup, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';

interface SelectionToolProps {
  selectedTool: string;
  selectedElements: string[];
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onLock: () => void;
  onUnlock: () => void;
}

export const SelectionTool: React.FC<SelectionToolProps> = ({ 
  selectedTool,
  selectedElements,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onGroup,
  onUngroup,
  onLock,
  onUnlock
}) => {
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');

  if (selectedTool !== 'select') return null;

  const hasSelection = selectedElements.length > 0;
  const multipleSelection = selectedElements.length > 1;

  const actions = [
    {
      label: 'نسخ',
      icon: Copy,
      action: onCopy,
      disabled: !hasSelection,
      shortcut: 'Ctrl+C'
    },
    {
      label: 'قص',
      icon: Scissors,
      action: onCut,
      disabled: !hasSelection,
      shortcut: 'Ctrl+X'
    },
    {
      label: 'لصق',
      icon: Clipboard,
      action: onPaste,
      disabled: false,
      shortcut: 'Ctrl+V'
    },
    {
      label: 'حذف',
      icon: Trash2,
      action: onDelete,
      disabled: !hasSelection,
      shortcut: 'Delete'
    }
  ];

  const groupActions = [
    {
      label: 'تجميع',
      icon: Group,
      action: onGroup,
      disabled: !multipleSelection
    },
    {
      label: 'إلغاء التجميع',
      icon: Ungroup,
      action: onUngroup,
      disabled: !hasSelection
    },
    {
      label: 'قفل',
      icon: Lock,
      action: onLock,
      disabled: !hasSelection
    },
    {
      label: 'إلغاء القفل',
      icon: Unlock,
      action: onUnlock,
      disabled: !hasSelection
    }
  ];

  return (
    <div className="space-y-4">
      {/* معلومات التحديد */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <MousePointer className="w-4 h-4" />
          <span className="text-sm font-medium font-arabic">العناصر المحددة</span>
        </div>
        <div className="text-sm font-arabic">
          {hasSelection ? (
            <span>تم تحديد <strong>{selectedElements.length}</strong> عنصر</span>
          ) : (
            <span className="text-gray-500">لا توجد عناصر محددة</span>
          )}
        </div>
      </div>

      {/* وضع التحديد */}
      <div className="space-y-2">
        <label className="text-sm font-medium font-arabic">وضع التحديد</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSelectionMode('single')}
            className={`p-2 rounded-lg border text-sm font-arabic transition-colors ${
              selectionMode === 'single'
                ? 'bg-black text-white border-black'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
            }`}
          >
            تحديد فردي
          </button>
          <button
            onClick={() => setSelectionMode('multiple')}
            className={`p-2 rounded-lg border text-sm font-arabic transition-colors ${
              selectionMode === 'multiple'
                ? 'bg-black text-white border-black'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
            }`}
          >
            تحديد متعدد
          </button>
        </div>
      </div>

      {/* أدوات التحكم الأساسية */}
      <div className="space-y-2">
        <label className="text-sm font-medium font-arabic">عمليات أساسية</label>
        <div className="grid grid-cols-2 gap-2">
          {actions.map(action => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                onClick={action.action}
                disabled={action.disabled}
                variant="outline"
                size="sm"
                className="text-xs font-arabic"
              >
                <Icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* أدوات التجميع والقفل */}
      <div className="space-y-2">
        <label className="text-sm font-medium font-arabic">تجميع وقفل</label>
        <div className="grid grid-cols-2 gap-2">
          {groupActions.map(action => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                onClick={action.action}
                disabled={action.disabled}
                variant="outline"
                size="sm"
                className="text-xs font-arabic"
              >
                <Icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* اختصارات لوحة المفاتيح */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium font-arabic mb-2">⌨️ اختصارات لوحة المفاتيح</h4>
        <div className="text-xs font-arabic space-y-1">
          {actions.filter(a => a.shortcut).map(action => (
            <div key={action.label} className="flex justify-between">
              <span>{action.label}</span>
              <code className="bg-white px-1 rounded text-xs">{action.shortcut}</code>
            </div>
          ))}
          <div className="flex justify-between">
            <span>تحديد الكل</span>
            <code className="bg-white px-1 rounded text-xs">Ctrl+A</code>
          </div>
          <div className="flex justify-between">
            <span>إلغاء التحديد</span>
            <code className="bg-white px-1 rounded text-xs">Esc</code>
          </div>
        </div>
      </div>

      {/* إرشادات التحديد */}
      <div className="text-xs text-gray-500 font-arabic space-y-1">
        <div>💡 استخدم Ctrl + النقر للتحديد المتعدد</div>
        <div>📦 اسحب لإنشاء صندوق تحديد</div>
        <div>🔒 العناصر المقفلة لا يمكن تحديدها</div>
      </div>
    </div>
  );
};