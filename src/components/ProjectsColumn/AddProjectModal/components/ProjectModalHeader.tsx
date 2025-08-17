
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Calendar } from 'lucide-react';

interface ProjectModalHeaderProps {
  isEditMode: boolean;
  onClose: () => void;
}

export const ProjectModalHeader: React.FC<ProjectModalHeaderProps> = ({
  isEditMode,
  onClose,
}) => {
  return (
    <DialogHeader className="px-8 pt-8 pb-6 flex-shrink-0 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="rounded-full bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center transition-colors"
        >
          <X className="text-gray-600" size={20} />
        </button>
        
        <DialogTitle className="text-xl font-semibold text-gray-900 font-arabic">
          إضافة حدث جديد
        </DialogTitle>
        
        <div className="rounded-full bg-black w-10 h-10 flex items-center justify-center">
          <Calendar className="text-white" size={20} />
        </div>
      </div>
    </DialogHeader>
  );
};
