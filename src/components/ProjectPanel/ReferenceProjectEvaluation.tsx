
import React from 'react';
import { useLovableConfig } from '../../hooks/useLovableConfig';

export const ReferenceProjectEvaluation: React.FC = () => {
  const config = useLovableConfig();

  return (
    <div
      className="h-full rounded-[20px] p-6"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        boxShadow: config.theme.glass.shadow
      }}
    >
      {/* Header */}
      <h3 
        className="text-lg font-bold mb-6"
        style={{ 
          fontFamily: config.theme.font,
          color: config.theme.colors.textPrimary
        }}
      >
        تقييم المشروع
      </h3>

      {/* Chart Placeholder */}
      <div className="w-full h-32 rounded-[12px] bg-white/20 mb-4 flex items-center justify-center"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <div className="w-full h-full bg-gradient-to-r from-purple-200/40 to-pink-200/40 rounded-[12px] relative overflow-hidden">
          {/* Simulated Chart Lines */}
          <div className="absolute inset-0 p-4">
            <div className="w-full h-full relative">
              {/* Grid lines */}
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-full border-t border-gray-300/30"
                  style={{ top: `${i * 20}%` }}
                />
              ))}
              {/* Chart bars */}
              <div className="absolute bottom-0 left-4 w-2 bg-gradient-to-t from-purple-500 to-pink-400 rounded-t-sm"
                style={{ height: '60%' }}
              />
              <div className="absolute bottom-0 left-8 w-2 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-sm"
                style={{ height: '40%' }}
              />
              <div className="absolute bottom-0 left-12 w-2 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-sm"
                style={{ height: '80%' }}
              />
              <div className="absolute bottom-0 left-16 w-2 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-t-sm"
                style={{ height: '50%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span 
            className="text-sm"
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textSecondary
            }}
          >
            معدل الإنجاز
          </span>
          <span 
            className="text-sm font-bold"
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textPrimary
            }}
          >
            78%
          </span>
        </div>
        <div className="flex justify-between">
          <span 
            className="text-sm"
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.textSecondary
            }}
          >
            تقييم الجودة
          </span>
          <span 
            className="text-sm font-bold"
            style={{ 
              fontFamily: config.theme.font,
              color: config.theme.colors.accent
            }}
          >
            ممتاز
          </span>
        </div>
      </div>
    </div>
  );
};
