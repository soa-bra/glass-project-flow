import React from 'react';
import { 
  Copy, 
  Scissors, 
  Clipboard, 
  Trash2, 
  Group, 
  Ungroup, 
  Lock, 
  Unlock,
  FlipHorizontal,
  FlipVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter
} from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { toast } from 'sonner';

const SelectionPanel: React.FC = () => {
  const { 
    selectedElementIds, 
    deleteElements,
    duplicateElement,
    clearSelection 
  } = useCanvasStore();

  const hasSelection = selectedElementIds.length > 0;
  const hasMultipleSelection = selectedElementIds.length > 1;

  const handleCut = () => {
    if (!hasSelection) return;
    // TODO: Implement cut
    toast.success('تم القص');
  };

  const handleCopy = () => {
    if (!hasSelection) return;
    // TODO: Implement copy
    toast.success('تم النسخ');
  };

  const handlePaste = () => {
    // TODO: Implement paste
    toast.success('تم اللصق');
  };

  const handleDelete = () => {
    if (!hasSelection) return;
    deleteElements(selectedElementIds);
    toast.success('تم الحذف');
  };

  const handleGroup = () => {
    if (!hasMultipleSelection) return;
    // TODO: Implement grouping
    toast.success('تم التجميع');
  };

  const handleUngroup = () => {
    if (!hasSelection) return;
    // TODO: Implement ungrouping
    toast.success('تم فك التجميع');
  };

  const handleLock = () => {
    if (!hasSelection) return;
    // TODO: Implement locking
    toast.success('تم القفل');
  };

  const handleUnlock = () => {
    if (!hasSelection) return;
    // TODO: Implement unlocking
    toast.success('تم فتح القفل');
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          إجراءات سريعة
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCut}
            disabled={!hasSelection}
            className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Scissors size={16} className="text-[hsl(var(--ink))]" />
            <span className="text-[12px] font-medium text-[hsl(var(--ink))]">قص</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!hasSelection}
            className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Copy size={16} className="text-[hsl(var(--ink))]" />
            <span className="text-[12px] font-medium text-[hsl(var(--ink))]">نسخ</span>
          </button>

          <button
            onClick={handlePaste}
            className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors"
          >
            <Clipboard size={16} className="text-[hsl(var(--ink))]" />
            <span className="text-[12px] font-medium text-[hsl(var(--ink))]">لصق</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={!hasSelection}
            className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} className="text-[hsl(var(--accent-red))]" />
            <span className="text-[12px] font-medium text-[hsl(var(--accent-red))]">حذف</span>
          </button>
        </div>
      </div>

      {/* Grouping */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          التجميع
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleGroup}
            disabled={!hasMultipleSelection}
            className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Group size={16} className="text-[hsl(var(--ink))]" />
            <span className="text-[12px] font-medium text-[hsl(var(--ink))]">تجميع</span>
          </button>

          <button
            onClick={handleUngroup}
            disabled={!hasSelection}
            className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Ungroup size={16} className="text-[hsl(var(--ink))]" />
            <span className="text-[12px] font-medium text-[hsl(var(--ink))]">فك التجميع</span>
          </button>
        </div>
      </div>

      {/* Lock/Unlock */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          القفل
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleLock}
            disabled={!hasSelection}
            className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Lock size={16} className="text-[hsl(var(--ink))]" />
            <span className="text-[12px] font-medium text-[hsl(var(--ink))]">قفل</span>
          </button>

          <button
            onClick={handleUnlock}
            disabled={!hasSelection}
            className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Unlock size={16} className="text-[hsl(var(--ink))]" />
            <span className="text-[12px] font-medium text-[hsl(var(--ink))]">فتح القفل</span>
          </button>
        </div>
      </div>

      {/* Transform */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          التحويل
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={!hasSelection}
            className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FlipHorizontal size={16} className="text-[hsl(var(--ink))]" />
            <span className="text-[12px] font-medium text-[hsl(var(--ink))]">عكس أفقي</span>
          </button>

          <button
            disabled={!hasSelection}
            className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FlipVertical size={16} className="text-[hsl(var(--ink))]" />
            <span className="text-[12px] font-medium text-[hsl(var(--ink))]">عكس عمودي</span>
          </button>
        </div>
      </div>

      {/* Alignment */}
      <div>
        <h4 className="text-[13px] font-semibold text-[hsl(var(--ink))] mb-3">
          المحاذاة
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            disabled={!hasMultipleSelection}
            className="flex flex-col items-center gap-1 px-2 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <AlignRight size={18} className="text-[hsl(var(--ink))]" />
            <span className="text-[10px] font-medium text-[hsl(var(--ink))]">يمين</span>
          </button>

          <button
            disabled={!hasMultipleSelection}
            className="flex flex-col items-center gap-1 px-2 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <AlignHorizontalJustifyCenter size={18} className="text-[hsl(var(--ink))]" />
            <span className="text-[10px] font-medium text-[hsl(var(--ink))]">وسط أفقي</span>
          </button>

          <button
            disabled={!hasMultipleSelection}
            className="flex flex-col items-center gap-1 px-2 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <AlignLeft size={18} className="text-[hsl(var(--ink))]" />
            <span className="text-[10px] font-medium text-[hsl(var(--ink))]">يسار</span>
          </button>

          <button
            disabled={!hasMultipleSelection}
            className="flex flex-col items-center gap-1 px-2 py-2 bg-[hsl(var(--panel))] rounded-[10px] hover:bg-[rgba(217,231,237,0.8)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <AlignVerticalJustifyCenter size={18} className="text-[hsl(var(--ink))]" />
            <span className="text-[10px] font-medium text-[hsl(var(--ink))]">وسط عمودي</span>
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="pt-4 border-t border-[#DADCE0]">
        <h4 className="text-[12px] font-semibold text-[hsl(var(--ink-60))] mb-2">
          اختصارات الكيبورد
        </h4>
        <div className="space-y-1.5 text-[11px] text-[hsl(var(--ink-60))]">
          <div className="flex justify-between">
            <span>تحديد الكل</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Cmd+A</code>
          </div>
          <div className="flex justify-between">
            <span>تكرار</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Cmd+D</code>
          </div>
          <div className="flex justify-between">
            <span>تجميع</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Cmd+G</code>
          </div>
          <div className="flex justify-between">
            <span>إلغاء التحديد</span>
            <code className="bg-[hsl(var(--panel))] px-1.5 py-0.5 rounded">Esc</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionPanel;
