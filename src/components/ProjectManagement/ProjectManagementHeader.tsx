import React, { useState } from 'react';
import { X, MoreHorizontal, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  project,
  onClose,
  onDelete,
  onArchive,
  onEdit,
  activeTab,
  onTabChange,
  tabs
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-plan':
        return 'bg-soabra-new-on-plan border-soabra-new-on-plan text-gray-800';
      case 'delayed':
        return 'bg-soabra-new-delayed border-soabra-new-delayed text-gray-800';
      case 'in-progress':
        return 'bg-soabra-new-in-progress border-soabra-new-in-progress text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-plan':
        return 'وفق الخطة';
      case 'delayed':
        return 'متأخر';
      case 'in-progress':
        return 'قيد التنفيذ';
      default:
        return 'غير محدد';
    }
  };
  return <div className="flex-shrink-0 mb-6">
      {/* الصف الأول */}
      <div className="flex items-center justify-between mb-6 py-0 my-[18px]">
        {/* العنوان على اليسار */}
        <h1 className="font-medium text-[#2A3437] font-arabic text-3xl my-[12px]">
          إدارة المشروع
        </h1>

        {/* التبويبات في المنتصف - مطابقة لتصميم لوحة الإدارة والتشغيل */}
        <div className="flex-1 flex justify-center mx-8">
          <div dir="rtl" style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }} className="w-full overflow-x-auto overflow-y-hidden no-scrollbar mx-0 px-[500px]">
            <div style={{
            direction: "rtl",
            width: "fit-content"
          }} className="gap-1 justify-end bg-transparent min-w-max flex-nowrap py-0 h-auto flex mx-0 px-0">
              {tabs.map(tab => <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`px-4 py-2 rounded-full font-arabic text-sm transition-all duration-200 border ${activeTab === tab.id ? 'bg-black text-white border-black shadow-sm' : 'bg-transparent text-gray-700 border-black hover:bg-white/50'}`}>
                  {tab.label}
                </button>)}
            </div>
          </div>
        </div>

        {/* الأزرار على اليمين */}
        <div className="flex items-center gap-3">
          {/* قائمة التعديل */}
          <div className="relative">
            <Select onValueChange={value => {
            if (value === 'delete') onDelete();else if (value === 'archive') onArchive();else if (value === 'edit') onEdit();
          }}>
              <SelectTrigger className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 flex items-center justify-center transition-all duration-300 group bg-transparent">
                <MoreHorizontal className="w-5 h-5 text-gray-700" />
              </SelectTrigger>
              <SelectContent className="font-arabic bg-white backdrop-filter backdrop-blur-lg border border-white/20">
                <SelectItem value="edit">تعديل المشروع</SelectItem>
                <SelectItem value="archive">أرشفة المشروع</SelectItem>
                <SelectItem value="delete" className="text-red-600">حذف المشروع</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* زر الإغلاق */}
          <button onClick={onClose} className="w-[50px] h-[50px] rounded-full border-2 border-[#3e494c]/50 flex items-center justify-center transition-all duration-300 group bg-transparent">
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* الصف الثاني */}
      

      {/* الصف الثالث - النبذة التعريفية */}
      

      <style>{`
        .no-scrollbar {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </div>;
};