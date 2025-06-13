
import React from 'react';
import { Plus, Calendar, Edit, FileText, Users } from 'lucide-react';

const toolbarButtons = [
  { id: 'add-task', label: 'إضافة مهمة', icon: Plus, variant: 'primary' },
  { id: 'generate-timeline', label: 'توليد الأيام', icon: Calendar, variant: 'secondary' },
  { id: 'edit-project', label: 'تعديل المشروع', icon: Edit, variant: 'secondary' },
  { id: 'reports', label: 'التقارير', icon: FileText, variant: 'secondary' },
  { id: 'team', label: 'الفريق', icon: Users, variant: 'secondary' }
];

export const ProjectToolbar: React.FC = () => {
  const handleButtonClick = (buttonId: string) => {
    console.log('تم النقر على:', buttonId);
    // يمكن إضافة منطق التفاعل هنا
  };

  return (
    <div className="flex flex-wrap gap-3 justify-end">
      {toolbarButtons.map((button) => (
        <button
          key={button.id}
          onClick={() => handleButtonClick(button.id)}
          className={`
            px-4 py-2 rounded-full font-arabic text-sm font-medium
            flex items-center gap-2 transition-all duration-200
            hover:scale-105 active:scale-95
            ${button.variant === 'primary' 
              ? 'bg-gray-800 text-white hover:bg-gray-700 shadow-md' 
              : 'bg-white/25 text-gray-700 hover:bg-white/35 backdrop-blur-sm border border-white/40'
            }
          `}
        >
          <button.icon size={16} />
          {button.label}
        </button>
      ))}
    </div>
  );
};
