
import React from 'react';
import { FolderIcon, X } from 'lucide-react';

interface ProjectModalHeaderProps {
  isEditMode: boolean;
  onClose: () => void;
}

export const ProjectModalHeader: React.FC<ProjectModalHeaderProps> = ({
  isEditMode,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between p-6">
      {/* أيقونة وعنوان */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
          <FolderIcon className="text-white" size={20} />
        </div>
        <h2 className="text-xl font-bold text-black font-arabic">
          {isEditMode ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        </h2>
      </div>

      {/* زر الإغلاق */}
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full border border-black bg-transparent hover:bg-black/5 flex items-center justify-center transition-colors"
      >
        <X className="text-black" size={16} />
      </button>
    </div>
  );
};
