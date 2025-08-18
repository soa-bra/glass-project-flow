
import React from 'react';
import { Button } from '@/components/ui/button';
import { TaskFormData } from './types';

interface TaskFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  saveButtonText?: string;
  validationErrors?: string[];
}

export const TaskFormActions: React.FC<TaskFormActionsProps> = ({
  onCancel,
  onSave,
  saveButtonText = "حفظ المهمة",
  validationErrors = []
}) => {
  return (
    <div className="pt-6 border-t border-white/20 mt-6">
      {/* منطقة عرض الأخطاء */}
      {validationErrors.length > 0 && (
        <div className="mb-4 p-3 border border-red-500 rounded-3xl">
          <p className="text-red-700 font-medium text-sm font-arabic mb-2">يرجى إكمال الحقول التالية:</p>
          <ul className="text-red-600 text-sm font-arabic space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex gap-4 justify-start">
        <Button
          onClick={onSave}
          className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saveButtonText}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic transition-colors"
        >
          إلغاء
        </Button>
      </div>
    </div>
  );
};
