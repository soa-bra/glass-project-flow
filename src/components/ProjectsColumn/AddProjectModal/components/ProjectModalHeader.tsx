
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ProjectModalHeaderProps {
  isEditMode: boolean;
  onClose: () => void;
}

export const ProjectModalHeader: React.FC<ProjectModalHeaderProps> = ({
  isEditMode,
  onClose,
}) => {
  return (
    <>
      <button
        onClick={onClose}
        className="absolute top-4 left-4 rounded-full bg-transparent hover:bg-black/10 border border-black/30 w-[32px] h-[32px] flex items-center justify-center transition z-10"
      >
        <X className="text-black" size={18} />
      </button>

      <DialogHeader className="px-8 pt-8 pb-4 flex-shrink-0">
        <DialogTitle className="text-2xl font-bold text-right font-arabic">
          {isEditMode ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        </DialogTitle>
      </DialogHeader>
    </>
  );
};
