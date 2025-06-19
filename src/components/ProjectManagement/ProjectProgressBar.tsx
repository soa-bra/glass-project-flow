
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
  totalSegments = 80,
  stages = [
    { label: 'التحضير', percent: 0 },
    { label: 'التنفيذ المبدئي', percent: 20 },
    { label: 'المراجعة الأولية', percent: 40 },
    { label: 'المعالجة الأولية', percent: 60 },
    { label: 'المراجعة النهائية', percent: 80 },
    { label: 'المعالجة النهائية', percent: 100 },
  ]
}) => {
  // التأكد من أن النسبة في النطاق الصحيح
  const safeProgress = Math.max(0, Math.min(100, progress || 0));
  
  // how many segments light up
  const litCount = Math.round((safeProgress / 100) * totalSegments);
  // width of each segment in percent
  const segW = 100 / totalSegments;

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
      {/* العنوان والوصف */}
      <div className="flex justify-between items-center mb-6">
        <div 
          className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm"
          style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
        >
          مقياس مراحل تقدم المشروع
        </div>
        <div 
          className="text-sm text-gray-600"
          style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
        >
          المهمة الحالية: {stages.find(s => s.percent <= safeProgress && (stages.find(next => next.percent > safeProgress)?.percent || 101) > s.percent)?.label || stages[stages.length - 1]?.label}
        </div>
      </div>

      {/* شريط التقدم الجديد - LED Strip */}
      <div className="relative w-full py-8 select-none">
        {/* the strips */}
        <div className="relative flex h-3 w-full overflow-hidden rounded-full bg-gray-200 p-0.5">
          {Array.from({ length: totalSegments }).map((_, i) => {
            // decide on lit vs unlit
            const isLit = i < litCount;
            // generate a subtle rainbow gradient along the lit portion
            const hue = 200 + Math.round((i / totalSegments) * 120); // from blue→green
            const bgColor = isLit ? `hsl(${hue}, 70%, 50%)` : '#e0e0e0';

            return (
              <motion.div
                key={i}
                className="flex-shrink-0 h-full rounded-sm"
                style={{
                  width: `${segW}%`,
                  background: bgColor,
                  marginRight: i < totalSegments - 1 ? '1px' : '0'
                }}
                initial={{ opacity: 0.3, scale: 0.8 }}
                animate={{ 
                  opacity: isLit ? 1 : 0.3,
                  scale: isLit ? 1 : 0.9
                }}
                transition={{ 
                  delay: i * 0.005, 
                  duration: 0.2,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25
                }}
              />
            );
          })}
        </div>

        {/* the milestone circles */}
        {stages.map(({ label, percent }) => {
          const reached = percent <= safeProgress;
          const isCurrent = percent > safeProgress && stages.filter(s => s.percent <= safeProgress).length === stages.indexOf(stages.find(s => s.percent === percent)!);
          
          return (
            <div
              key={label}
              className="absolute top-0"
              style={{
                left: `${percent}%`,
                transform: 'translateX(-50%)',
                top: '-12px'
              }}
            >
              <motion.div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  reached
                    ? 'bg-green-500 border-green-500 text-white shadow-lg'
                    : isCurrent
                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                      : 'bg-white border-gray-300 text-gray-500'
                }`}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: isCurrent ? 1.4 : 1.1,
                  opacity: isCurrent ? 1 : (reached ? 0.9 : 0.6),
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 25,
                  duration: 0.5
                }}
                style={{
                  boxShadow: isCurrent ? '0 4px 12px rgba(59, 130, 246, 0.4)' : reached ? '0 4px 12px rgba(34, 197, 94, 0.4)' : 'none'
                }}
              >
                {reached ? '✓' : isCurrent ? '●' : '○'}
              </motion.div>
              
              {/* التسمية */}
              <div 
                className="text-xs text-gray-700 text-center mt-3 whitespace-nowrap px-2 py-1 rounded-md"
                style={{ 
                  fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '11px',
                  fontWeight: '500'
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
          className="text-xl font-bold text-gray-800"
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
          className="text-sm text-gray-600 mt-1"
          style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
        >
          {litCount} من {totalSegments} مهمة مكتملة
        </div>
      </div>
    </div>
  );
};
