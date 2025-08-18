
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Info } from 'lucide-react';

interface ProjectModalFooterProps {
  isEditMode: boolean;
  onSave: () => void;
  onCancel: () => void;
  notifications?: string[];
  validationErrors?: string[];
}

export const ProjectModalFooter: React.FC<ProjectModalFooterProps> = ({
  isEditMode,
  onSave,
  onCancel,
  notifications = [],
  validationErrors = []
}) => {
  return (
    <div className="flex-shrink-0 px-8 pb-8">
      <div className="flex gap-4 justify-between items-center pt-6 border-t border-white/20">
        <div className="flex gap-4">
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
        
        {/* منطقة الإشعارات والتنبيهات */}
        <div className="flex flex-col gap-2 max-w-md">
          {validationErrors.map((error, index) => (
            <div key={`error-${index}`} className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-arabic">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          ))}
          {notifications.map((notification, index) => (
            <div key={`notification-${index}`} className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm font-arabic">
              <Info size={16} />
              <span>{notification}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
