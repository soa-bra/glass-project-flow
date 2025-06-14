
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useLovableConfig } from '../../hooks/useLovableConfig';

export const ReferenceLegalCard: React.FC = () => {
  const config = useLovableConfig();

  return (
    <div
      className="h-full rounded-[20px] p-6 flex flex-col items-center justify-center"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        boxShadow: config.theme.glass.shadow
      }}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <h3 
          className="text-xl font-bold"
          style={{ 
            fontFamily: config.theme.font,
            color: config.theme.colors.textPrimary
          }}
        >
          القانونية
        </h3>
      </div>

      {/* Loading/Refresh Icon */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div 
          className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center mb-4"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <RotateCcw 
            size={24} 
            className="text-gray-500 animate-spin" 
            style={{ animationDuration: '2s' }}
          />
        </div>
        <span 
          className="text-sm text-center"
          style={{ 
            fontFamily: config.theme.font,
            color: config.theme.colors.textSecondary
          }}
        >
          جاري التحميل...
        </span>
      </div>
    </div>
  );
};
