import React from 'react';

interface SelectionModeToggleProps {
  selectionMode: 'single' | 'multiple';
  onSelectionModeChange: (mode: 'single' | 'multiple') => void;
}

export const SelectionModeToggle: React.FC<SelectionModeToggleProps> = ({ 
  selectionMode, 
  onSelectionModeChange 
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium font-arabic">وضع التحديد</label>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onSelectionModeChange('single')}
          className={`p-2 rounded-lg border text-sm font-arabic transition-colors ${
            selectionMode === 'single'
              ? 'bg-black text-white border-black'
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
          }`}
        >
          تحديد فردي
        </button>
        <button
          onClick={() => onSelectionModeChange('multiple')}
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
  );
};