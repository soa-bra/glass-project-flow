
import React from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface WorkInfoPanelProps {
  project: ProjectCardProps;
}

export const WorkInfoPanel: React.FC<WorkInfoPanelProps> = ({ project }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="rounded-3xl bg-white/30 backdrop-blur-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">تفاصيل المشروع</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-arabic text-gray-600">الوصف</label>
            <p className="text-gray-800 font-arabic">{project.description}</p>
          </div>
          <div>
            <label className="text-sm font-arabic text-gray-600">مدير المشروع</label>
            <p className="text-gray-800 font-arabic">{project.owner}</p>
          </div>
          <div>
            <label className="text-sm font-arabic text-gray-600">تاريخ البداية</label>
            <p className="text-gray-800 font-arabic">{project.date}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white/30 backdrop-blur-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">فريق العمل</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white/40 rounded-xl">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
              أ
            </div>
            <div>
              <div className="font-arabic font-semibold text-gray-800">أحمد محمد</div>
              <div className="text-xs text-gray-600 font-arabic">مطور</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/40 rounded-xl">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
              س
            </div>
            <div>
              <div className="font-arabic font-semibold text-gray-800">سارة أحمد</div>
              <div className="text-xs text-gray-600 font-arabic">مصممة</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
