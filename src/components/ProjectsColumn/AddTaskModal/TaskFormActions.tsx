
import React from 'react';
import { Button } from '@/components/ui/button';

interface TaskFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  saveButtonText?: string;
}

export const TaskFormActions: React.FC<TaskFormActionsProps> = ({
  onCancel,
  onSave,
  saveButtonText = "حفظ المهمة"
}) => {
  return (
    <div className="flex gap-4 justify-start pt-6 border-t border-white/20 mt-6">
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
  );
};
