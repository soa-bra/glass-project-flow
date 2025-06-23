
import React, { useEffect, useRef, useState } from 'react';

interface Stage {
  label: string;
}

interface ProjectProgressBarProps {
  progress: number; // نسبة التقدم من 0 إلى 100
  stages: Stage[];
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  progress,
  stages
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [segmentCount, setSegmentCount] = useState(100);
  const segmentWidthPx = 3;
  const segmentGapPx = 3;
  const segmentHeight = 25;

  useEffect(() => {
    const calculateSegments = () => {
      if (barRef.current) {
        const totalWidth = barRef.current.offsetWidth;
        const count = Math.floor(totalWidth / (segmentWidthPx + segmentGapPx));
        setSegmentCount(count);
      }
    };
    calculateSegments();
    const resizeObserver = new ResizeObserver(calculateSegments);
    if (barRef.current) resizeObserver.observe(barRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const litCount = Math.round(segmentCount * progress / 100);
  const segments = Array.from({ length: segmentCount }, (_, i) => i);
  const circleSize = segmentHeight * 1.3 * 1.2; // أكبر 20٪ من الحجم العادي
  const bubbleSize = circleSize * 1.2;

  // حساب المرحلة الحالية بناءً على التقدم الفعلي
  const currentStageIndex = Math.floor(progress / 100 * (stages.length - 1));
  const reversedStages = [...stages].reverse(); // لعكس ترتيب المراحل

  const getStageLeft = (index: number) => {
    const usableWidth = segmentCount - 4; // خصم أول وآخر شرطتين
    const step = usableWidth / (stages.length - 1);
    return (index * step + 2) / segmentCount * 100; // موضع المرحلة في الشريط المعكوس
  };

  // ألوان التدرج الجديدة
  const colorGradient = ['#d9f3a8', '#5ac0d8', '#d9d2fd', '#fba0a3', '#fbe2aa'];

  return (
    <div className="relative w-full flex flex-col items-start font-arabic pt-12 pb-10 px-6" style={{ background: 'transparent' }}>
      {/* فقاعة تقدم المشروع - ثابتة في بداية الشريط */}
      <div
        className="absolute z-10 text-black text-right"
        style={{
          background: 'linear-gradient(135deg, #B9F3A8, #d4ffd0)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '14px 20px',
          borderRadius: '50px',
          minWidth: '160px',
          top: `-${circleSize / 1.8}px`,
          right: `calc(80% - ${bubbleSize / 1.8}px)` // ثابتة في بداية الشريط (اليمين)
        }}
      >
        <div className="font-bold text-lg">تقدم المشروع</div>
        <div className="text-sm font-light text-gray-800">{stages[currentStageIndex]?.label}</div>
      </div>

      {/* شريط الشرائح */}
      <div ref={barRef} className="relative flex items-center justify-start flex-row-reverse gap-[3px] w-[80%] h-[25px]">
        {segments.map((idx) => {
          const reversedIdx = segmentCount - 1 - idx;
          const isLit = reversedIdx < litCount;
          const isFirstTwo = reversedIdx >= segmentCount - 2;
          
          // استخدام الألوان الجديدة
          let color = '#eee';
          if (isFirstTwo) {
            color = '#d9f3a8';
          } else if (isLit) {
            const gradientPosition = reversedIdx / segmentCount;
            const colorIndex = Math.floor(gradientPosition * (colorGradient.length - 1));
            const nextColorIndex = Math.min(colorIndex + 1, colorGradient.length - 1);
            const localPosition = (gradientPosition * (colorGradient.length - 1)) - colorIndex;
            
            // interpolate between colors
            const currentColor = colorGradient[colorIndex];
            const nextColor = colorGradient[nextColorIndex];
            
            // Simple color interpolation
            color = currentColor;
          }
          
          return (
            <div
              key={idx}
              style={{
                width: `${segmentWidthPx}px`,
                height: `${segmentHeight}px`,
                backgroundColor: color,
                borderRadius: '2px',
                boxShadow: isLit ? `0 0 4px ${color}` : undefined,
                transition: 'background-color 0.2s',
              }}
            />
          );
        })}

        {/* دوائر المراحل */}
        {reversedStages.map((stage, i) => {
          const stageProgress = getStageLeft(i);
          // إصلاح حساب isCompleted للمراحل المعكوسة
          const originalStageIndex = stages.length - 1 - i;
          const stageThreshold = (originalStageIndex / (stages.length - 1)) * 100;
          const isCompleted = progress >= stageThreshold;

          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `calc(${stageProgress}% - ${circleSize / 2}px)`,
                top: `-${(circleSize - segmentHeight) / 2}px`,
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: `${circleSize}px`,
                  height: `${circleSize}px`,
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#B9F3A8' : 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(16px)',
                  border: 'none', // إزالة الحد الأسود
                  boxShadow: isCompleted
                    ? '0 0 6px #B9F3A8'
                    : 'inset 0 0 2px rgba(0,0,0,0.25)',
                }}
              >
                {isCompleted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                    <polyline points="5 13 10 18 20 6" />
                  </svg>
                ) : (
                  // دائرة مفرغة بنفس سمك علامة الصح
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                )}
              </div>
              <div
                className="text-center mt-2 font-medium text-black"
                style={{
                  fontSize: '0.675rem',
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'max-content',
                  top: `${circleSize + 8}px`,
                }}
              >
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
