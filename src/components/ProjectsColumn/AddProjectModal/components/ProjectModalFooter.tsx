
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
    <div className="flex-shrink-0 px-8 pb-8 border-t border-gray-200 pt-6">
      <div className="flex gap-4 justify-start">
        <Button
          onClick={onSave}
          className="bg-black text-white hover:bg-gray-800 font-arabic rounded-full h-12 px-8"
        >
          إضافة الحدث
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50 font-arabic rounded-full h-12 px-8"
        >
          إلغاء
        </Button>
      </div>
    </div>
  );
};
