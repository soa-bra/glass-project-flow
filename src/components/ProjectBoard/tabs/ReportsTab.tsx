
import React from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface ReportsTabProps {
  project: ProjectCardProps;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ project }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-6">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">تقارير الأداء</h3>
        <div className="space-y-4">
          <div className="p-4 bg-white/40 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="font-arabic text-gray-700">معدل الإنجاز</span>
              <span className="font-bold text-green-600">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="p-4 bg-white/40 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="font-arabic text-gray-700">الميزانية المستخدمة</span>
              <span className="font-bold text-blue-600">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-6">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">إحصائيات المشروع</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white/40 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">24</div>
            <div className="text-sm font-arabic text-gray-600">مهمة مكتملة</div>
          </div>
          <div className="text-center p-4 bg-white/40 rounded-xl">
            <div className="text-2xl font-bold text-gray-800">6</div>
            <div className="text-sm font-arabic text-gray-600">مهمة متبقية</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
