import React from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({ 
  selectedCount, 
  onClearSelection 
}) => {
  const handleBulkAction = (action: string) => {
    console.log(`Performing bulk action: ${action} on ${selectedCount} tasks`);
    // Here you would implement the actual bulk action logic
  };

  return (
    <div className="bg-[#F2FFFF] rounded-3xl p-4 border border-black/10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-black">
          تم تحديد {selectedCount} مهمة
        </span>
        <button
          onClick={onClearSelection}
          className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
        >
          إلغاء التحديد
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleBulkAction('move')}
          className="bg-transparent border border-black/10 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-colors"
        >
          نقل
        </button>
        <button
          onClick={() => handleBulkAction('assign')}
          className="bg-transparent border border-black/10 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-colors"
        >
          تعيين
        </button>
        <button
          onClick={() => handleBulkAction('priority')}
          className="bg-transparent border border-black/10 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5 transition-colors"
        >
          تغيير الأولوية
        </button>
        <button
          onClick={() => handleBulkAction('delete')}
          className="bg-[#f1b5b9] text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-[#f1b5b9]/80 transition-colors"
        >
          حذف
        </button>
      </div>
    </div>
  );
};