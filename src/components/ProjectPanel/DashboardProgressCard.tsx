
import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface DashboardProgressCardProps {
  completedTasks: number;
  totalTasks: number;
}

export const DashboardProgressCard: React.FC<DashboardProgressCardProps> = ({
  completedTasks,
  totalTasks
}) => {
  const config = useLovableConfig();
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div 
      className="h-full rounded-[20px] p-4 flex flex-col"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        boxShadow: config.theme.glass.shadow
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-sm font-semibold"
          style={{ 
            fontFamily: config.theme.font,
            color: config.theme.colors.textPrimary
          }}
        >
          الإنجاز
        </h3>
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${config.theme.colors.accent}, ${config.theme.colors.success})` }}
        >
          <Target size={16} className="text-white" />
        </div>
      </div>

      {/* Progress Circle - Smaller for narrow column */}
      <div className="flex-1 flex items-center justify-center mb-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(from 0deg, ${config.theme.colors.accent} 0%, ${config.theme.colors.accent} ${progressPercentage}%, #E5E7EB ${progressPercentage}%, #E5E7EB 100%)`
              }}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span 
                  className="text-sm font-bold"
                  style={{ 
                    fontFamily: config.theme.font,
                    color: config.theme.colors.textPrimary
                  }}
                >
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Stats - Compact */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span 
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textSecondary
            }}
          >
            مكتمل
          </span>
          <span 
            className="font-semibold"
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.accent
            }}
          >
            {completedTasks}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span 
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textSecondary
            }}
          >
            المجموع
          </span>
          <span 
            className="font-semibold"
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textPrimary
            }}
          >
            {totalTasks}
          </span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div 
        className="flex items-center justify-center mt-3 p-1 rounded-[8px]"
        style={{ backgroundColor: `${config.theme.colors.accent}15` }}
      >
        <TrendingUp size={12} style={{ color: config.theme.colors.accent }} className="ml-1" />
        <span 
          className="text-xs"
          style={{ 
            fontFamily: config.theme.font,
            color: config.theme.colors.accent
          }}
        >
          متقدم
        </span>
      </div>
    </div>
  );
};
