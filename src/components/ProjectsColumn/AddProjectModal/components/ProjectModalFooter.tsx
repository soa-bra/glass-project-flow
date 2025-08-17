
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
    <div className="p-6 border-t border-black/10">
      <div className="flex gap-3">
        <Button
          onClick={onSave}
          className="bg-black text-white hover:bg-black/90 font-arabic rounded-full px-6 py-3 text-sm"
        >
          {isEditMode ? 'حفظ التعديلات' : 'إضافة المشروع'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="bg-white/60 text-black border border-black/10 hover:bg-white/80 font-arabic rounded-full px-6 py-3 text-sm"
        >
          إلغاء
        </Button>
      </div>
    </div>
  );
};
