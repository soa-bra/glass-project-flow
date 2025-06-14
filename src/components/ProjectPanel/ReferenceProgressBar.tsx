
import React from 'react';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface ReferenceProgressBarProps {
  progress: number;
}

export const ReferenceProgressBar: React.FC<ReferenceProgressBarProps> = ({
  progress
}) => {
  const config = useLovableConfig();
  
  const phases = config.phaseBar.phases;
  const completedPhases = Math.floor((progress / 100) * phases.length);

  return (
    <div
      className="mx-6 p-6 rounded-[20px] mb-6"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        boxShadow: config.theme.glass.shadow
      }}
    >
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-lg font-bold"
          style={{
            fontFamily: config.theme.font,
            color: config.theme.colors.textPrimary
          }}
        >
          مراحل المشروع
        </h3>
        <span
          className="text-sm px-3 py-1 rounded-full"
          style={{
            backgroundColor: `${config.theme.colors.accent}15`,
            color: config.theme.colors.accent,
            fontFamily: config.theme.font
          }}
        >
          {Math.round(progress)}% مكتمل
        </span>
      </div>

      {/* شريط التقدم */}
      <div className="flex items-center gap-2">
        {phases.map((phase, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center flex-1">
              {/* دائرة المرحلة */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  index < completedPhases
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : index === completedPhases
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <span className="text-xs font-bold">{index + 1}</span>
              </div>
              
              {/* اسم المرحلة */}
              <span
                className="text-xs text-center"
                style={{
                  fontFamily: config.theme.font,
                  color: index <= completedPhases ? config.theme.colors.textPrimary : config.theme.colors.textSecondary
                }}
              >
                {phase}
              </span>
            </div>
            
            {/* خط الربط */}
            {index < phases.length - 1 && (
              <div
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  index < completedPhases - 1
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gray-200'
                }`}
                style={{ maxWidth: '80px' }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
