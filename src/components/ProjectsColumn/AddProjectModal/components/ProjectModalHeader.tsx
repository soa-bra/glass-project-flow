
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';

interface ProjectModalHeaderProps {
  isEditMode: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const ProjectModalHeader: React.FC<ProjectModalHeaderProps> = ({
  isEditMode,
  onClose,
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { value: 'basic', label: 'المعلومات الأساسية' },
    { value: 'client', label: 'بيانات العميل' },
    { value: 'tasks', label: 'المهام' },
    { value: 'partnerships', label: 'الشراكات' },
    { value: 'contract', label: 'العقد' },
  ];

  return (
    <DialogHeader className="px-8 pt-8 pb-2 flex-shrink-0">
      <div className="grid grid-cols-3 items-center gap-4 mb-4">
        {/* العنوان - العمود الأول */}
        <DialogTitle className="text-2xl font-bold font-arabic text-right">
          {isEditMode ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        </DialogTitle>
        
        {/* قائمة التبويبات - العمود الأوسط */}
        <div className="flex justify-center">
          <AnimatedTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            className="font-arabic"
          />
        </div>
        
        {/* زر الإغلاق - العمود الثالث */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-transparent hover:bg-black/10 border border-black/30 w-[32px] h-[32px] flex items-center justify-center transition"
          >
            <X className="text-black" size={18} />
          </button>
        </div>
      </div>
    </DialogHeader>
  );
};
