import React from 'react'; 
import { motion } from 'framer-motion';

interface Stage {
  label: string;
}

interface ProjectProgressBarProps {
  /** نسبة التقدم 0–100 */
  progress: number;
  /** مصفوفة المراحل بترتيبها */
  stages: Stage[];
  /** عدد الشرائح الكلي في الشريط */
  segmentCount?: number;
  /** طول الشريط كنسبة من الحاوية */
  widthPct?: string;
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  progress,
  stages,
  segmentCount = 100,
  widthPct = '80%',
}) => {
  // عدد الشرائح "المضيئة" بناءً على التقدم
  const litCount = Math.round((segmentCount * progress) / 100);
  // مصفوفة الشرائح 0..segmentCount-1
  const segments = Array.from({ length: segmentCount }, (_, i) => i);
  // عرض كل شريحة كنسبة من الشريط
  const segmentWidthPct = 100 / segmentCount;

  // عدد المراحل
  const stageCount = stages.length;
  // لحساب موقع كل مرحلة على الشريط (0–100%)
  const getStageLeft = (index: number) =>
    (index / (stageCount - 1)) * 100;

  return (
    <div className="relative select-none p-6 bg-white/60 backdrop-blur-lg rounded-2xl">
      {/* عنوان الشريط */}
      <div className="absolute top-4 right-4">
        <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
          تقدم المشروع
        </div>
      </div>

      {/* المهمة الحالية */}
      <div className="absolute top-4 left-4 text-gray-700 text-sm">
        المهمة الحالية:{' '}
        <span className="font-semibold">
          {stages[
            Math.floor((progress / 100) * (stageCount - 1))
          ].label}
        </span>
      </div>

      {/* شريط الشرائح */} 
      <div className="mx-auto" style={{ width: widthPct }}>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          {segments.map((idx) => {
            const isLit = idx < litCount;
            const hue = Math.round((360 * idx) / segmentCount);
            const color = `hsl(${hue}, 70%, 50%)`;
            return (
              <motion.div
                key={idx}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${idx * segmentWidthPct}%`,
                  width: `${segmentWidthPct}%`,
                  backgroundColor: isLit ? color : undefined,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLit ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
            );
          })}
        </div>

        {/* دوائر المراحل */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2"
          style={{ width: widthPct }}
        >
          {stages.map((stage, i) => {
            const reached = progress >= (i / (stageCount - 1)) * 100;
            return (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${getStageLeft(i)}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <motion.div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center 
                    border border-white/30 backdrop-blur-sm 
                    ${reached ? 'bg-green-500 text-white' : 'bg-white/20'}
                  `}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  {reached ? (
                    <div className="w-4 h-4 rounded-full bg-white text-green-600 font-bold flex items-center justify-center text-xs">
                      ✓
                    </div>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-black/80" />
                  )}
                </motion.div>
                <div className="mt-2 px-2 py-1 bg-white rounded-md text-xs text-gray-700 whitespace-nowrap">
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* نسبة الإنجاز */}
      <div className="mt-8 text-center">
        <motion.div
          className="text-2xl font-bold text-gray-800"
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
        >
          {Math.round(progress)}% مكتمل
        </motion.div>
      </div>
    </div>
  );
};
