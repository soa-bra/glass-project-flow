
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Loader } from 'lucide-react';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface PhaseProgressProps {
  completedTasks: number;
  totalTasks: number;
}

export const PhaseProgress: React.FC<PhaseProgressProps> = ({
  completedTasks,
  totalTasks
}) => {
  const config = useLovableConfig();
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const phases = config.phaseBar.phases;
  const activePhases = Math.floor((progressPercentage / 100) * phases.length);

  return (
    <div 
      className="bg-white/40 backdrop-blur-[24px] border border-white/35 rounded-[20px] p-6"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        boxShadow: config.theme.glass.shadow
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 
          className="text-lg font-semibold text-gray-800"
          style={{ 
            fontFamily: config.theme.font,
            color: config.theme.colors.textPrimary
          }}
        >
          مراحل تقدم المشروع
        </h3>
        <span 
          className="text-xl font-bold"
          style={{ 
            color: config.theme.colors.accent,
            fontFamily: config.theme.font
          }}
        >
          {Math.round(progressPercentage)}%
        </span>
      </div>

      <div className="relative">
        {/* Progress Track */}
        <div className="flex items-center justify-between mb-8">
          {phases.map((phase, index) => {
            const isActive = index < activePhases;
            const isCurrent = index === activePhases;
            const isLocked = index > activePhases;

            return (
              <div key={phase} className="flex flex-col items-center relative">
                {/* Phase Circle */}
                <motion.div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm relative z-10
                    ${isActive 
                      ? 'bg-gradient-to-r from-sky-400 to-purple-600' 
                      : isCurrent 
                        ? 'bg-amber-500 animate-pulse' 
                        : 'bg-gray-300'
                    }
                  `}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: config.phaseBar.transition.duration,
                    type: config.phaseBar.transition.type as "spring",
                    stiffness: config.phaseBar.transition.stiffness,
                    delay: index * 0.1
                  }}
                >
                  {isActive ? (
                    <Check size={20} />
                  ) : isCurrent ? (
                    <Loader size={20} className="animate-spin" />
                  ) : (
                    <Lock size={20} />
                  )}
                </motion.div>

                {/* Phase Label */}
                <span 
                  className="text-xs text-center mt-3 font-medium max-w-[80px]"
                  style={{ 
                    fontFamily: config.theme.font,
                    color: isActive ? config.theme.colors.accent : config.theme.colors.textSecondary
                  }}
                >
                  {phase}
                </span>

                {/* Connecting Line */}
                {index < phases.length - 1 && (
                  <motion.div
                    className="absolute top-6 left-12 h-0.5 bg-gray-200"
                    style={{ 
                      width: 'calc(100vw / 4 - 48px)',
                      background: isActive ? config.phaseBar.segmentStyle.activeGradient : config.phaseBar.segmentStyle.inactive
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isActive ? 1 : 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ 
              background: config.phaseBar.segmentStyle.activeGradient
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ 
              duration: config.phaseBar.transition.duration,
              type: config.phaseBar.transition.type as "spring",
              stiffness: config.phaseBar.transition.stiffness
            }}
          />
        </div>

        {/* Progress Text */}
        <div className="flex justify-between mt-4 text-sm">
          <span 
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textSecondary
            }}
          >
            {completedTasks} من {totalTasks} مهمة مكتملة
          </span>
          <span 
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.accent
            }}
          >
            المرحلة {activePhases + 1} من {phases.length}
          </span>
        </div>
      </div>
    </div>
  );
};
