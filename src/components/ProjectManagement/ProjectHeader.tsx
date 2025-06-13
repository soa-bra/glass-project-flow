
import React from 'react';
import { useProjectPanel } from './ProjectPanelContext';

export const ProjectHeader: React.FC = () => {
  const { project, projectColor } = useProjectPanel();

  return (
    <div className="space-y-4">
      {/* العنوان والوصف */}
      <div className="text-right">
        <h1 
          id="project-title"
          data-project-title
          tabIndex={-1}
          className="text-3xl font-bold text-gray-800 mb-2 font-arabic outline-none"
        >
          {project.title}
        </h1>
        <p className="text-lg text-gray-600 font-arabic leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* شارة الميزانية */}
      <div className="flex justify-end">
        <div 
          className="px-6 py-3 rounded-full bg-white/25 backdrop-blur-sm border border-white/40
                     flex items-center gap-3 shadow-sm"
        >
          <div className="text-right">
            <div className="text-sm text-gray-600 font-arabic">الميزانية الإجمالية</div>
            <div className="text-xl font-bold text-gray-800 font-arabic">
              {project.budget.toLocaleString('ar-SA')} ر.س
            </div>
          </div>
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: projectColor }}
          />
        </div>
      </div>
    </div>
  );
};
