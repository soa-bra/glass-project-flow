
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
      <div className="grid grid-cols-[2fr_auto_1fr] items-center gap-4 mb-4 w-full">
        {/* العنوان - العمود الأول */}
        <DialogTitle className="text-2xl font-bold font-arabic text-right justify-self-start truncate">
          {isEditMode ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        </DialogTitle>
        
        {/* قائمة التبويبات - العمود الأوسط (أقرب لزر الإغلاق) */}
        <AnimatedTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          className="font-arabic justify-self-end"
        />
        
        {/* زر الإغلاق - العمود الثالث */}
        <button
          onClick={onClose}
          className="rounded-full bg-transparent hover:bg-black/10 border border-black w-[32px] h-[32px] flex items-center justify-center transition justify-self-end"
        >
          <X className="text-black" size={18} />
        </button>
      </div>
    </DialogHeader>
  );
};
