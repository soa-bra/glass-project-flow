
import React from 'react';
import { Check, Lock, Loader } from 'lucide-react';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface RedesignedPhaseBarProps {
  progress: number; // 0-100
}

export const RedesignedPhaseBar: React.FC<RedesignedPhaseBarProps> = ({ progress }) => {
  const config = useLovableConfig();
  const phases = config.phaseBar.phases;
  const activeIdx = Math.floor((phases.length * progress) / 100);

  return (
    <div
      className="w-full py-4 px-6 rounded-[20px] mt-2 mb-2 flex flex-col gap-2"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        boxShadow: config.theme.glass.shadow
      }}
    >
      <div className="flex justify-between items-center">
        {phases.map((phase, idx) => {
          const isActive = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          return (
            <div className="flex-1 flex flex-col items-center gap-2 px-1 relative" key={phase}>
              <span
                className={`rounded-full shadow flex items-center justify-center mb-1`}
                style={{
                  width: 34, height: 34,
                  background: isActive
                    ? 'linear-gradient(90deg,#81D4FA,#7C4DFF)'
                    : isCurrent
                      ? '#FFB300'
                      : '#E0E0E0',
                  color: isActive || isCurrent ? 'white' : '#aaa',
                  fontWeight: 700,
                  transition: 'background 0.2s'
                }}
              >
                {isActive ? <Check size={18} /> : isCurrent ? <Loader size={18} className="animate-spin" /> : <Lock size={16}/>}
              </span>
              <span
                className="text-xs font-medium text-center"
                style={{ fontFamily: config.theme.font, color: isActive ? config.theme.colors.accent : config.theme.colors.textSecondary }}
              >
                {phase}
              </span>
              {/* Connecting line */}
              {idx < phases.length - 1 && (
                <div
                  className="absolute top-[17px] left-full right-0 h-1"
                  style={{
                    width: 40,
                    zIndex: -1,
                    background: isActive
                      ? config.phaseBar.segmentStyle.activeGradient
                      : config.phaseBar.segmentStyle.inactive,
                    height: 4,
                    borderRadius: 2
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Bottom slim progress */}
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
        <div
          className="h-full"
          style={{
            width: `${progress}%`,
            background: config.phaseBar.segmentStyle.activeGradient,
            transition: 'width .5s',
            borderRadius: 20
          }}
        ></div>
      </div>
      <div className="flex justify-between text-xs mt-0 px-2" style={{fontFamily: config.theme.font, color: config.theme.colors.textSecondary}}>
        <span>اكتمل {activeIdx} مرحلة من {phases.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
};
