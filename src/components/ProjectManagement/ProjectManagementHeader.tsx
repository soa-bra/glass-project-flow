import React, { useState } from 'react';
import { X, MoreHorizontal, Edit, Archive, Trash } from 'lucide-react';
import { Project } from '@/types/project';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import FloatingActionMenu from '@/components/ui/FloatingActionMenu';
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
  const animatedTabItems = tabs.map(tab => ({
    value: tab.id,
    label: tab.label
  }));
  return <div className="flex-shrink-0 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-[#2A3437] font-arabic text-3xl my-[12px]">
          إدارة المشروع
        </h1>

        <div className="flex-1 flex justify-center">
          <div className="w-fit">
            <AnimatedTabs tabs={animatedTabItems} activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FloatingActionMenu
            className="relative"
            options={[
              {
                label: "تعديل المشروع",
                onClick: onEdit,
                Icon: <Edit className="w-4 h-4" />
              },
              {
                label: "أرشفة المشروع", 
                onClick: onArchive,
                Icon: <Archive className="w-4 h-4" />
              },
              {
                label: "حذف المشروع",
                onClick: onDelete,
                Icon: <Trash className="w-4 h-4" />
              }
            ]}
          />

          <button onClick={onClose} className="w-[50px] h-[50px] bg-transparent border border-black rounded-full flex items-center justify-center transition-all duration-300 bg-transparent hover:bg-white/20">
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>;
};