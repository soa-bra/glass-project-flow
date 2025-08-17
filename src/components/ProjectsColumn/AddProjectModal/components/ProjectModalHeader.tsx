
import React from 'react';
import { X, FolderPlus } from 'lucide-react';

interface ProjectModalHeaderProps {
  isEditMode: boolean;
  onClose: () => void;
}

export const ProjectModalHeader: React.FC<ProjectModalHeaderProps> = ({
  isEditMode,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-black/10">
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/5 transition-colors"
      >
        <X size={16} className="text-black" />
      </button>

      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-black font-arabic">
          {isEditMode ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        </h2>
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <FolderPlus size={16} className="text-white" />
        </div>
      </div>
    </div>
  );
};
