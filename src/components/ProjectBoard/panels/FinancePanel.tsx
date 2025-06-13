
import React from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface FinancePanelProps {
  project: ProjectCardProps;
}

export const FinancePanel: React.FC<FinancePanelProps> = ({ project }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Budget Overview */}
      <div className="lg:col-span-2 rounded-3xl bg-white/30 backdrop-blur-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold font-arabic text-gray-800 mb-4">نظرة عامة على الميزانية</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="75, 100"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">75%</div>
                <div className="text-xs text-gray-600 font-arabic">مستخدم</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="space-y-4">
        <div className="rounded-3xl bg-white/30 backdrop-blur-xl p-4 shadow-lg">
          <div className="text-sm font-arabic text-gray-600">إجمالي الميزانية</div>
          <div className="text-lg font-bold text-gray-800">{project.value}</div>
        </div>
        <div className="rounded-3xl bg-white/30 backdrop-blur-xl p-4 shadow-lg">
          <div className="text-sm font-arabic text-gray-600">المصروف</div>
          <div className="text-lg font-bold text-red-600">11.25K</div>
        </div>
        <div className="rounded-3xl bg-white/30 backdrop-blur-xl p-4 shadow-lg">
          <div className="text-sm font-arabic text-gray-600">المتبقي</div>
          <div className="text-lg font-bold text-green-600">3.75K</div>
        </div>
      </div>
    </div>
  );
};
