
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
    <div className="flex items-center justify-end gap-3 p-6 border-t border-black/10">
      <Button
        onClick={onCancel}
        variant="outline"
        className="bg-white/30 hover:bg-white/40 border border-black/20 text-black rounded-full font-arabic"
      >
        إلغاء
      </Button>
      <Button
        onClick={onSave}
        className="bg-black hover:bg-black/90 text-white rounded-full font-arabic"
      >
        {isEditMode ? 'حفظ التعديلات' : 'حفظ المشروع'}
      </Button>
    </div>
  );
};
