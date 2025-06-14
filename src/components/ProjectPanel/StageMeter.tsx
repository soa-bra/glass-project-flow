
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Loader } from 'lucide-react';

interface StageMeterProps {
  progress: number; // 0 to 100
  segments?: number;
  height?: string;
}

export const StageMeter: React.FC<StageMeterProps> = ({
  progress = 0,
  segments = 7,
  height = '46px'
}) => {
  const activeSegments = Math.floor((progress / 100) * segments);
  
  return (
    <div className="relative bg-white/20 backdrop-blur-[10px] border border-white/30 rounded-[20px] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          تقدم المشروع
        </h3>
        <span className="text-lg font-bold text-blue-600 font-arabic">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="flex items-center gap-2" style={{ height }}>
        {Array.from({ length: segments }, (_, index) => {
          const isActive = index < activeSegments;
          const isCurrent = index === activeSegments;
          const isLocked = index > activeSegments;
          
          return (
            <motion.div
              key={index}
              className={`
                flex-1 rounded-full relative overflow-hidden transition-all duration-500
                ${isActive 
                  ? 'bg-gradient-to-r from-sky-400 to-blue-600' 
                  : 'bg-gray-200/50'
                }
              `}
              style={{ height: '8px' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Progress fill animation */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-600"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                />
              )}
              
              {/* Stage indicator bubble */}
              <div className={`
                absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 
                rounded-full flex items-center justify-center transition-all duration-300
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : isCurrent 
                    ? 'bg-amber-500 text-white animate-pulse' 
                    : 'bg-gray-300 text-gray-500'
                }
              `}>
                {isActive ? (
                  <Check size={12} />
                ) : isCurrent ? (
                  <Loader size={12} className="animate-spin" />
                ) : (
                  <Lock size={12} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 font-arabic">
          {activeSegments} من {segments} مراحل مكتملة
        </p>
      </div>
    </div>
  );
};
