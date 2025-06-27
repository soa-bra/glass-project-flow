
import React, { useState } from 'react';
import { X, MoreHorizontal, Edit, Archive, Trash } from 'lucide-react';
import { Project } from '@/types/project';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 flex items-center justify-center transition-all duration-300 bg-transparent hover:bg-white/20">
                <MoreHorizontal className="w-5 h-5 text-gray-700" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-white/90 backdrop-blur-lg border border-white/20 shadow-lg font-arabic"
              sideOffset={5}
            >
              <DropdownMenuItem 
                onClick={onEdit}
                className="flex items-center gap-2 text-gray-700 hover:bg-white/60 cursor-pointer"
              >
                <Edit className="w-4 h-4" />
                تعديل المشروع
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onArchive}
                className="flex items-center gap-2 text-gray-700 hover:bg-white/60 cursor-pointer"
              >
                <Archive className="w-4 h-4" />
                أرشفة المشروع
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <Trash className="w-4 h-4" />
                حذف المشروع
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={onClose}
            className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 flex items-center justify-center transition-all duration-300 bg-transparent hover:bg-white/20"
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
