
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export interface Stage {
  key: string;
  label: string;
  position: number; // من 0 إلى 1
}

export interface ProjectProgressBarProps {
  /** عدد الشرائح الكلية */
  totalSegments?: number;
  /** النسبة المكتملة بين 0 و 100 */
  progress: number;
  /** قائمة المراحل (position من 0–1) */
  stages?: Stage[];
  /** مفتاح المرحلة الحالية */
  currentStage?: string;
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  totalSegments = 40,
  progress,
  stages = [
    { key: 'preparation', label: 'التحضير', position: 0.1 },
    { key: 'initial-implementation', label: 'التنفيذ المبدئي', position: 0.25 },
    { key: 'initial-review', label: 'المراجعة الأولية', position: 0.4 },
    { key: 'initial-processing', label: 'المعالجة الأولية', position: 0.55 },
    { key: 'final-review', label: 'المراجعة النهائية', position: 0.75 },
    { key: 'final-processing', label: 'المعالجة النهائية', position: 0.9 }
  ],
  currentStage
}) => {
  // تحويل النسبة من 0-100 إلى 0-1
  const completion = progress / 100;
  
  // عدد الشرائح المضيئة
  const litCount = Math.round(totalSegments * completion);

  // لوحة ألوان الطيف
  const rainbow = useMemo(() => [
    '#FF3CAC', // وردي
    '#784BA0', // بنفسجي
    '#2B86C5', // أزرق
    '#22D9C3', // تركواز
    '#A5FF43', // أخضر فاقع
    '#FFEB3B', // أصفر
  ], []);

  // مصفوفة الشرائح
  const segmentArray = useMemo(
    () => Array.from({ length: totalSegments }, (_, i) => i),
    [totalSegments]
  );

  // تحديد المرحلة الحالية تلقائياً إذا لم يتم تمريرها
  const getCurrentStage = () => {
    if (currentStage) return currentStage;
    
    if (completion >= 0.9) return 'final-processing';
    if (completion >= 0.75) return 'final-review';
    if (completion >= 0.55) return 'initial-processing';
    if (completion >= 0.4) return 'initial-review';
    if (completion >= 0.25) return 'initial-implementation';
    return 'preparation';
  };

  const activeStage = getCurrentStage();

  return (
    <div className="bg-white/40 backdrop-blur-[20px] rounded-3xl p-6 border border-white/20">
      {/* العنوان والوصف */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-arabic text-sm">
          مقياس مراحل تقدم المشروع
        </div>
        <div className="text-sm text-gray-600 font-arabic">
          المهمة الحالية: {stages.find(s => s.key === activeStage)?.label}
        </div>
      </div>

      {/* شريط التقدم الجديد - LED Strip */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 12,
        margin: '2rem 0',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* الشريط الرئيسي */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          borderRadius: 6,
          backgroundColor: '#E0E0E0',
          padding: 2,
        }}>
          {segmentArray.map(idx => {
            const isLit = idx < litCount;
            // اختيار اللون حسب فهرس الشريحة من الطيف
            const color = isLit
              ? rainbow[Math.floor((idx / Math.max(litCount, 1)) * (rainbow.length - 1))]
              : 'transparent';

            return (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: isLit ? 1 : 0.2 }}
                transition={{ 
                  duration: 0.3, 
                  delay: idx * 0.02,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }}
                style={{
                  flex: 1,
                  height: '100%',
                  margin: '0 0.5px',
                  background: color,
                  borderRadius: 1,
                }}
              />
            );
          })}
        </div>

        {/* دوائر المراحل والتسميات */}
        {stages.map(stage => {
          const leftPerc = stage.position * 100;
          const isCurrent = stage.key === activeStage;
          const isCompleted = completion > stage.position;

          return (
            <div key={stage.key}
              style={{
                position: 'absolute',
                left: `calc(${leftPerc}% - 16px)`,
                top: -16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: isCurrent ? 1.3 : 1,
                  opacity: isCurrent ? 1 : (isCompleted ? 0.8 : 0.5),
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20,
                  duration: 0.4
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : isCurrent ? '⟳' : '🔒'}
              </motion.div>
              
              {/* التسمية */}
              <div className="text-xs font-arabic text-gray-600 text-center mt-2 whitespace-nowrap">
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* نسبة التقدم */}
      <div className="mt-6 text-center">
        <motion.div 
          className="text-lg font-bold text-gray-800 font-arabic"
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200,
            duration: 0.5
          }}
        >
          {Math.round(progress)}% مكتمل
        </motion.div>
      </div>
    </div>
  );
};
