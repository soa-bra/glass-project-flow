
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TaskFormData } from './types';

interface TaskFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  saveButtonText?: string;
  taskData: TaskFormData;
}

export const TaskFormActions: React.FC<TaskFormActionsProps> = ({
  onCancel,
  onSave,
  saveButtonText = "حفظ المهمة",
  taskData
}) => {
  const { toast } = useToast();

  const validateRequiredFields = () => {
    const missingFields: string[] = [];
    
    if (!taskData.title.trim()) {
      missingFields.push('عنوان المهمة');
    }
    
    if (!taskData.dueDate) {
      missingFields.push('تاريخ الاستحقاق');
    }
    
    if (taskData.attachments.length === 0) {
      missingFields.push('الملفات');
    }
    
    return missingFields;
  };

  const handleSave = () => {
    const missingFields = validateRequiredFields();
    
    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "خطأ في البيانات المطلوبة",
        description: `يرجى إكمال الحقول التالية: ${missingFields.join('، ')}`,
      });
      return;
    }
    
    onSave();
  };

  return (
    <div className="flex gap-4 justify-start pt-6 border-t border-white/20 mt-6">
      <Button
        onClick={handleSave}
        className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {saveButtonText}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="px-6 py-3 bg-red-500 hover:bg-red-600 border border-red-500 rounded-full text-white font-medium font-arabic transition-colors"
      >
        إلغاء
      </Button>
    </div>
  );
};
