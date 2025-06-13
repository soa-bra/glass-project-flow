
import React from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface CustomPanelProps {
  project: ProjectCardProps;
}

export const CustomPanel: React.FC<CustomPanelProps> = ({ project }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="rounded-3xl bg-white/30 backdrop-blur-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">إعدادات مخصصة</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl">
            <span className="font-arabic text-gray-700">تفعيل الإشعارات</span>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl">
            <span className="font-arabic text-gray-700">مشاركة التقارير</span>
            <div className="w-12 h-6 bg-gray-300 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl">
            <span className="font-arabic text-gray-700">النسخ الاحتياطي التلقائي</span>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white/30 backdrop-blur-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">تخصيص العرض</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-arabic text-gray-600 mb-2">نمط العرض</label>
            <select className="w-full p-3 bg-white/40 rounded-xl font-arabic text-gray-700 border-none">
              <option>عرض الشبكة</option>
              <option>عرض القائمة</option>
              <option>عرض الجدول الزمني</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-arabic text-gray-600 mb-2">لون السمة</label>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer border-2 border-blue-700"></div>
              <div className="w-8 h-8 bg-green-500 rounded-full cursor-pointer"></div>
              <div className="w-8 h-8 bg-purple-500 rounded-full cursor-pointer"></div>
              <div className="w-8 h-8 bg-orange-500 rounded-full cursor-pointer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
