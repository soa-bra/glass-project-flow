
import React from 'react';
import { X, MoreHorizontal } from 'lucide-react';
import { Project } from '@/types/project';

interface TabItem {
  id: string;
  label: string;
}

interface ProjectManagementHeaderProps {
  project: Project;
  onClose: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onEdit: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: TabItem[];
}

export const ProjectManagementHeader: React.FC<ProjectManagementHeaderProps> = ({
  onClose,
  onDelete,
  onArchive,
  onEdit,
  activeTab,
  onTabChange,
  tabs
}) => {
  return (
    <div className="flex-shrink-0 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-[#2A3437] font-arabic text-3xl my-[12px]">
          إدارة المشروع
        </h1>

        <div className="flex-1 flex justify-center">
          <div className="w-full overflow-x-auto no-scrollbar" dir="rtl">
            <div className="gap-1 justify-center bg-transparent min-w-max flex-nowrap h-auto flex mx-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 rounded-full font-arabic text-sm transition-all duration-200 border ${
                    activeTab === tab.id
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-transparent text-gray-700 border-black hover:bg-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // يمكن إضافة منطق القائمة المنسدلة هنا
              console.log('Options menu clicked');
            }}
            className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 flex items-center justify-center transition-all duration-300 bg-transparent"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={onClose}
            className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 flex items-center justify-center transition-all duration-300 bg-transparent"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <style>{`
        .no-scrollbar {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </div>
  );
};
