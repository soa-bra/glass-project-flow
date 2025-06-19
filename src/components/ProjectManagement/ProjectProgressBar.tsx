
import React from 'react';
import { motion } from 'framer-motion';

export interface Stage {
  label: string;
  /** position along 0–100% of the bar */
  percent: number;
}

export interface ProjectProgressBarProps {
  /** overall completion % (0–100) */
  progress: number;
  /** how many little "LEDs" to draw */
  totalSegments?: number;
  /** the labeled milestones along the bar */
  stages?: Stage[];
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  progress,
  totalSegments = 100,
  stages = [
    { label: 'التحضير', percent: 0 },
    { label: 'التنفيذ المبدئي', percent: 25 },
    { label: 'المراجعة الأولية', percent: 50 },
    { label: 'التنفيذ البديل', percent: 75 },
    { label: 'المعالجة النهائية', percent: 100 },
  ]
}) => {
  // التأكد من أن النسبة في النطاق الصحيح
  const safeProgress = Math.max(0, Math.min(100, progress || 0));
  
  // how many segments light up
  const litCount = Math.round((safeProgress / 100) * totalSegments);

  // Generate gradient colors for different sections
  const getSegmentColor = (index: number, isLit: boolean) => {
    if (!isLit) return '#e5e7eb'; // gray for unlit segments
    
    const ratio = index / totalSegments;
    
    if (ratio < 0.25) return '#ef4444'; // red
    if (ratio < 0.5) return '#f97316'; // orange  
    if (ratio < 0.75) return '#3b82f6'; // blue
    return '#22c55e'; // green
  };

  return (
    <div 
      className="rounded-3xl p-6 border border-white/20"
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        fontFamily: 'IBM Plex Sans Arabic, sans-serif'
      }}
    >
      {/* العنوان */}
      <div className="flex justify-between items-center mb-8">
        <div 
          className="bg-green-100 text-green-800 px-6 py-3 rounded-full text-base font-medium"
          style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
        >
          مقياس مراحل تقدم للمشروع
        </div>
        <div 
          className="text-base text-gray-700 font-medium"
          style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
        >
          المهمة الحالية: تطوير سوبرا
        </div>
      </div>

      {/* شريط التقدم الرئيسي */}
      <div className="relative w-full py-12 select-none">
        {/* الخط الأساسي للشريط */}
        <div className="relative flex h-4 w-full overflow-hidden rounded-full bg-gray-200 border border-gray-300">
          {Array.from({ length: totalSegments }).map((_, i) => {
            const isLit = i < litCount;
            const segmentColor = getSegmentColor(i, isLit);
            const segmentWidth = 100 / totalSegments;

            return (
              <motion.div
                key={i}
                className="flex-shrink-0 h-full"
                style={{
                  width: `${segmentWidth}%`,
                  background: segmentColor,
                  borderRight: i < totalSegments - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none'
                }}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: isLit ? 1 : 0.3,
                }}
                transition={{ 
                  delay: i * 0.002, 
                  duration: 0.3,
                }}
              />
            );
          })}
        </div>

        {/* دوائر المراحل */}
        {stages.map(({ label, percent }, stageIndex) => {
          const isReached = percent <= safeProgress;
          const isCurrent = !isReached && stageIndex > 0 && stages[stageIndex - 1].percent <= safeProgress;
          
          return (
            <div
              key={label}
              className="absolute"
              style={{
                left: `${percent}%`,
                transform: 'translateX(-50%)',
                top: '-8px'
              }}
            >
              {/* الدائرة */}
              <motion.div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-3 ${
                  isReached
                    ? 'bg-white border-gray-400 text-gray-700'
                    : isCurrent
                      ? 'bg-white border-gray-400 text-gray-700' 
                      : 'bg-white border-gray-300 text-gray-400'
                }`}
                initial={{ scale: 0.8 }}
                animate={{
                  scale: 1,
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 25,
                  delay: stageIndex * 0.1
                }}
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}
              >
                {isReached ? '○' : isCurrent ? '○' : '○'}
              </motion.div>
              
              {/* التسمية */}
              <div 
                className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 text-center whitespace-nowrap px-3 py-1 rounded-md"
                style={{ 
                  fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '12px',
                  fontWeight: '500',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>

      {/* نسبة التقدم */}
      <div className="mt-8 text-center">
        <motion.div 
          className="text-2xl font-bold text-gray-800"
          style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200,
            duration: 0.6
          }}
        >
          {Math.round(safeProgress)}% مكتمل
        </motion.div>
        <div 
          className="text-sm text-gray-600 mt-2"
          style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
        >
          {litCount} من {totalSegments} مهمة مكتملة
        </div>
      </div>
    </div>
  );
};
