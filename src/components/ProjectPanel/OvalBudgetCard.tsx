
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface OvalBudgetCardProps {
  total: number;
  spent: number;
  remaining: number;
}

export const OvalBudgetCard: React.FC<OvalBudgetCardProps> = ({
  total,
  spent,
  remaining
}) => {
  const config = useLovableConfig();
  
  const strokeCount = useMemo(() => {
    return Math.max(60, Math.min(160, Math.ceil(300 / 6))); // Responsive stroke count
  }, []);

  const spentPercentage = total > 0 ? (spent / total) * 100 : 0;
  const circumference = 2 * Math.PI * 85; // radius = 85
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (spentPercentage / 100) * circumference;

  return (
    <div 
      className="h-full p-6 rounded-[20px] flex flex-col items-center justify-center"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        boxShadow: config.theme.glass.shadow
      }}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <h3 
          className="text-lg font-semibold"
          style={{ 
            fontFamily: config.theme.font,
            color: config.theme.colors.textPrimary
          }}
        >
          الميزانية
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <span className="text-xs" style={{ color: config.theme.colors.textSecondary }}>
            المصروف
          </span>
        </div>
      </div>

      {/* Oval Progress */}
      <div className="relative flex-1 flex items-center justify-center">
        <svg width="200" height="140" className="transform -rotate-90">
          {/* Background oval */}
          <ellipse
            cx="100"
            cy="70"
            rx="85"
            ry="55"
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="8"
            className="opacity-30"
          />
          
          {/* Progress oval */}
          <motion.ellipse
            cx="100"
            cy="70"
            rx="85"
            ry="55"
            fill="none"
            stroke="url(#budgetGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ 
              duration: 1.2, 
              ease: config.theme.ease as [number, number, number, number]
            }}
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9C27B0" />
              <stop offset="50%" stopColor="#E91E63" />
              <stop offset="100%" stopColor="#D500F9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div 
            className="text-3xl font-bold mb-1"
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textPrimary
            }}
          >
            {remaining.toLocaleString('ar-SA')}
          </div>
          <div 
            className="text-sm font-medium mb-2"
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textSecondary
            }}
          >
            ريال باقي من الميزانية
          </div>
          <div 
            className="text-xs px-3 py-1 rounded-full"
            style={{ 
              backgroundColor: `${config.theme.colors.accent}15`,
              color: config.theme.colors.accent,
              fontFamily: config.theme.font
            }}
          >
            التفاصيل &lt;
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="w-full mt-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <div 
            className="text-lg font-bold"
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textPrimary
            }}
          >
            {spent.toLocaleString('ar-SA')}
          </div>
          <div 
            className="text-xs"
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textSecondary
            }}
          >
            مصروف
          </div>
        </div>
        <div>
          <div 
            className="text-lg font-bold"
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textPrimary
            }}
          >
            {total.toLocaleString('ar-SA')}
          </div>
          <div 
            className="text-xs"
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textSecondary
            }}
          >
            إجمالي
          </div>
        </div>
      </div>
    </div>
  );
};
