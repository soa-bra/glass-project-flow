
import React from 'react';
import { UnifiedButton } from '@/components/ui/UnifiedButton';

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
        <UnifiedButton
          variant="primary"
          onClick={onSave}
        >
          {isEditMode ? 'حفظ التعديلات' : 'حفظ المشروع'}
        </UnifiedButton>
        <UnifiedButton
          variant="secondary"
          onClick={onCancel}
        >
          إلغاء
        </UnifiedButton>
      </div>
    </div>
  );
};
