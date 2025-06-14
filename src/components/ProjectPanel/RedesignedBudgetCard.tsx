
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
  const remainingPercent = 100 - spentPercent;

  return (
    <div
      className="h-full p-7 rounded-[20px] flex flex-col items-center justify-center shadow"
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
        <span className="text-xs text-gray-700" style={{fontFamily: config.theme.font}}>المصروف</span>
      </div>
      <div className="relative flex-1 flex flex-col items-center justify-center w-full mb-3">
        <svg width="180" height="120" className="transform -rotate-90">
          {/* Vanilla oval background */}
          <ellipse
            cx="90"
            cy="60"
            rx="70"
            ry="45"
            fill="none"
            stroke="#E0E0E0"
            strokeWidth={7}
            className="opacity-40"
          />
          {/* Progress oval */}
          <ellipse
            cx="90"
            cy="60"
            rx="70"
            ry="45"
            fill="none"
            stroke="url(#g-redesign)"
            strokeWidth={7}
            strokeDasharray={220}
            strokeDashoffset={220 - (220 * spentPercent / 100)}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="g-redesign" x1="0" y1="0" x2="180" y2="0">
              <stop offset="0%" stopColor="#7C4DFF" />
              <stop offset="50%" stopColor="#81D4FA" />
              <stop offset="100%" stopColor="#E91E63" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold" style={{
            color: config.theme.colors.textPrimary,
            fontFamily: config.theme.font
          }}>{remaining.toLocaleString('ar-SA')}</span>
          <span className="text-xs text-gray-500 mb-1" style={{fontFamily: config.theme.font}}>ريال باقي</span>
        </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold"
            style={{color: config.theme.colors.textPrimary, fontFamily: config.theme.font}}
          >{spent.toLocaleString('ar-SA')}</span>
          <span className="text-xs text-gray-500" style={{fontFamily: config.theme.font}}>مصروف</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold"
            style={{color: config.theme.colors.textPrimary, fontFamily: config.theme.font}}
          >{total.toLocaleString('ar-SA')}</span>
          <span className="text-xs text-gray-500" style={{fontFamily: config.theme.font}}>إجمالي</span>
        </div>
      </div>
      <button
        className="w-full mt-4 py-2 rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#81D4FA] text-white font-semibold text-base shadow transition-all hover:opacity-90"
        style={{fontFamily: config.theme.font}}
      >
        التفاصيل المالية
      </button>
    </div>
  );
};
