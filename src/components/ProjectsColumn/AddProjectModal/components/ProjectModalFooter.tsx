
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProjectFormErrors } from './ProjectFormErrors';

interface ProjectModalFooterProps {
  isEditMode: boolean;
  onSave: () => void;
  onCancel: () => void;
  validationErrors?: string[];
}

export const ProjectModalFooter: React.FC<ProjectModalFooterProps> = ({
  isEditMode,
  onSave,
  onCancel,
  validationErrors,
}) => {
  return (
    <div className="flex-shrink-0 px-8 pb-8">
      <ProjectFormErrors validationErrors={validationErrors} />
      <div className="flex gap-4 justify-start pt-6 border-t border-white/20">
        <Button
          onClick={onSave}
          className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isEditMode ? 'حفظ التعديلات' : 'حفظ المشروع'}
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
