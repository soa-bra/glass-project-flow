
import React from 'react';
import { useProjectPanel } from './ProjectPanelContext';

const steps = [
  { id: 'planning', label: 'التخطيط', progress: 100 },
  { id: 'design', label: 'التصميم', progress: 80 },
  { id: 'development', label: 'التطوير', progress: 60 },
  { id: 'testing', label: 'الاختبار', progress: 30 },
  { id: 'deployment', label: 'النشر', progress: 0 }
];

export const ProjectStepper: React.FC = () => {
  const { project, projectColor } = useProjectPanel();

  return (
    <div className="bg-white/15 backdrop-blur-sm border border-white/40 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">مراحل المشروع</h3>
        <div className="text-sm text-gray-600 font-arabic">
          {project.progress}% مكتمل
        </div>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* نقطة المرحلة */}
            <div className="flex flex-col items-center flex-1">
              <div 
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  step.progress > 0 
                    ? 'border-transparent shadow-md' 
                    : 'border-gray-300 bg-white/50'
                }`}
                style={{ 
                  backgroundColor: step.progress > 0 ? projectColor : 'transparent',
                  boxShadow: step.progress > 0 ? `0 0 8px ${projectColor}40` : 'none'
                }}
              />
              <div className="text-xs text-gray-600 font-arabic mt-1 text-center">
                {step.label}
              </div>
            </div>

            {/* خط الربط */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-300 mx-1">
                <div 
                  className="h-full transition-all duration-500"
                  style={{
                    backgroundColor: step.progress === 100 ? projectColor : 'transparent',
                    width: step.progress === 100 ? '100%' : '0%'
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
