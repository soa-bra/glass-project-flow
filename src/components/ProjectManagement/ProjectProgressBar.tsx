
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
  // التأكد من أن النسبة في النطاق الصحيح
  const safeProgress = Math.max(0, Math.min(100, progress || 0));
  
  // تحويل النسبة من 0-100 إلى 0-1
  const completion = safeProgress / 100;
  
  // عدد الشرائح المضيئة
  const litCount = Math.round(totalSegments * completion);

  // لوحة ألوان الطيف المحسنة
  const rainbow = useMemo(() => [
    '#FF6B6B', // أحمر فاقع
    '#4ECDC4', // تركواز
    '#45B7D1', // أزرق
    '#96CEB4', // أخضر فاتح
    '#FFEAA7', // أصفر ذهبي
    '#DDA0DD', // بنفسجي فاتح
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

  // دالة لحساب لون الشريحة
  const getSegmentColor = (segmentIndex: number) => {
    if (segmentIndex >= litCount) return 'transparent';
    
    // حساب النسبة للشريحة الحالية
    const ratio = segmentIndex / Math.max(litCount - 1, 1);
    const colorIndex = Math.floor(ratio * (rainbow.length - 1));
    
    return rainbow[colorIndex] || rainbow[0];
  };

  return (
    <div 
      className="rounded-3xl p-6 border border-white/20"
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* العنوان والوصف */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
          مقياس مراحل تقدم المشروع
        </div>
        <div className="text-sm text-gray-600" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
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
          backgroundColor: '#E5E7EB',
          padding: 2,
          gap: '1px',
        }}>
          {segmentArray.map(idx => {
            const isLit = idx < litCount;
            const segmentColor = getSegmentColor(idx);

            return (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0.2, scale: 0.8 }}
                animate={{ 
                  opacity: isLit ? 1 : 0.3,
                  scale: isLit ? 1 : 0.9,
                  backgroundColor: segmentColor
                }}
                transition={{ 
                  duration: 0.4, 
                  delay: idx * 0.015,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25
                }}
                style={{
                  flex: 1,
                  height: '100%',
                  borderRadius: 2,
                  backgroundColor: segmentColor,
                  minWidth: '2px',
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
                top: -20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: isCurrent ? 1.4 : 1.1,
                  opacity: isCurrent ? 1 : (isCompleted ? 0.9 : 0.6),
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 25,
                  duration: 0.5
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : isCurrent 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-gray-300 text-gray-500'
                }`}
                style={{
                  boxShadow: isCurrent ? '0 4px 12px rgba(59, 130, 246, 0.4)' : isCompleted ? '0 4px 12px rgba(34, 197, 94, 0.4)' : 'none'
                }}
              >
                {isCompleted ? '✓' : isCurrent ? '●' : '○'}
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
                {stage.label}
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
