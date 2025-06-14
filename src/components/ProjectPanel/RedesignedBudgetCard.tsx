
import React from 'react';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface RedesignedBudgetCardProps {
  total: number;
  spent: number;
  remaining: number;
}

export const RedesignedBudgetCard: React.FC<RedesignedBudgetCardProps> = ({
  total, spent, remaining
}) => {
  const config = useLovableConfig();
  const spentPercent = total > 0 ? Math.min(100, (spent / total) * 100) : 0;

  return (
    <div
      className="h-full p-6 rounded-[20px] flex flex-col items-center justify-center"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        boxShadow: config.theme.glass.shadow,
      }}
    >
      <div className="w-full flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold" style={{
          fontFamily: config.theme.font,
          color: config.theme.colors.textPrimary
        }}>الميزانية</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <span className="text-xs" style={{fontFamily: config.theme.font, color: config.theme.colors.textSecondary}}>
            التفاصيل
          </span>
        </div>
      </div>

      {/* Oval Progress - مطابق للصورة المرجعية */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full mb-4">
        <svg width="200" height="140" className="transform -rotate-90">
          {/* Background oval */}
          <ellipse
            cx="100"
            cy="70"
            rx="80"
            ry="50"
            fill="none"
            stroke="#E0E0E0"
            strokeWidth={8}
            className="opacity-30"
          />
          {/* Progress oval - لون وردي-بنفسجي مطابق للصورة */}
          <ellipse
            cx="100"
            cy="70"
            rx="80"
            ry="50"
            fill="none"
            stroke="url(#pinkPurpleGradient)"
            strokeWidth={8}
            strokeDasharray={400}
            strokeDashoffset={400 - (400 * spentPercent / 100)}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="pinkPurpleGradient" x1="0" y1="0" x2="200" y2="0">
              <stop offset="0%" stopColor="#E91E63" />
              <stop offset="50%" stopColor="#9C27B0" />
              <stop offset="100%" stopColor="#673AB7" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Content - مطابق للصورة المرجعية */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold mb-1" style={{
            color: config.theme.colors.textPrimary,
            fontFamily: config.theme.font
          }}>15K</span>
          <span className="text-xs text-center px-3" style={{
            fontFamily: config.theme.font,
            color: config.theme.colors.textSecondary
          }}>باقي من الميزانية</span>
          <span className="text-xs mt-2 px-2 py-1 rounded-full" style={{
            backgroundColor: `${config.theme.colors.accent}15`,
            color: config.theme.colors.accent,
            fontFamily: config.theme.font
          }}>التفاصيل &lt;</span>
        </div>
      </div>
    </div>
  );
};
