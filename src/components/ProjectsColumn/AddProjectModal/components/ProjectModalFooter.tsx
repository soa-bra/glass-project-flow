
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProjectModalFooterProps {
  isEditMode: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const ProjectModalFooter: React.FC<ProjectModalFooterProps> = ({
  isEditMode,
  onSave,
  onCancel,
}) => {
  return (
    <div className="flex-shrink-0 px-8 pb-8">
      <div className="flex gap-4 justify-start pt-6 border-t border-white/20">
        <Button
          onClick={onSave}
          className="bg-black text-white hover:bg-gray-800 font-arabic rounded-full"
        >
          {isEditMode ? 'حفظ التعديلات' : 'حفظ المشروع'}
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
    </div>
  );
};
