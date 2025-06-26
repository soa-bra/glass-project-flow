
import React from 'react';
import { Button } from '@/components/ui/button';

interface TaskFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
}

export const TaskFormActions: React.FC<TaskFormActionsProps> = ({
  onCancel,
  onSave
}) => {
  return (
    <div className="flex gap-4 justify-start pt-6 border-t border-white/20">
      <Button 
        onClick={onSave} 
        className="bg-black text-white hover:bg-gray-800 font-arabic rounded-full"
      >
        حفظ المهمة
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel} 
        className="bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/50 font-arabic rounded-full"
      >
        إلغاء
      </Button>
    </div>
  );
};
