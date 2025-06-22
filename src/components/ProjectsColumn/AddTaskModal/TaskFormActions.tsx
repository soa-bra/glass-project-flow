
import React from 'react';
import { Button } from '@/components/ui/button';

interface TaskFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
}

export const TaskFormActions: React.FC<TaskFormActionsProps> = ({
  onCancel,
  onSave,
}) => {
  return (
    <div className="flex gap-4 justify-start pt-6 border-t border-white/20">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border-black text-black hover:bg-black/10 font-arabic"
      >
        إلغاء
      </Button>
      <Button
        onClick={onSave}
        className="bg-black text-white hover:bg-gray-800 font-arabic"
      >
        حفظ المهمة
      </Button>
    </div>
  );
};
