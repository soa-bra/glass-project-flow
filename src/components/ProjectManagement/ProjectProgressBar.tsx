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
  const circleSize = segmentHeight * 1.3; // جميع الدوائر أكبر بـ30٪ من الشريط
  const bubbleSize = circleSize * 1.2;

  const currentStageIndex = Math.floor(progress / 100 * (stages.length - 1));
  const reversedStages = [...stages].reverse();

  const getStageLeft = (index: number) => {
    const usableWidth = segmentCount - 4;
    const step = usableWidth / (stages.length - 1);
    return (index * step + 2) / segmentCount * 100;
  };

  return (
    <div className="relative w-full flex flex-col items-start font-arabic pt-12 pb-10 px-6" style={{ background: 'transparent' }}>
      <div
        className="absolute z-10 text-black text-right"
        style={{
          background: 'linear-gradient(135deg, #B9F3A8, #d4ffd0)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '14px 20px',
          borderRadius: '50px',
          minWidth: '160px',
          top: `-${circleSize / 1.8}px`,
          right: `calc(80% - ${bubbleSize / 1.8}px)`
        }}
      >
        <div className="font-bold text-lg">تقدم المشروع</div>
        <div className="text-sm font-light text-gray-800">{stages[currentStageIndex]?.label}</div>
      </div>

      <div ref={barRef} className="relative flex items-center justify-start flex-row-reverse gap-[3px] w-[80%] h-[25px]">
        {segments.map((idx) => {
          const reversedIdx = segmentCount - 1 - idx;
          const isLit = reversedIdx < litCount;
          const isFirstTwo = reversedIdx >= segmentCount - 2;
          const color = isFirstTwo
            ? '#B9F3A8'
            : `hsl(${(reversedIdx / segmentCount) * 360}, 40%, 65%)`; // تقليل التشبع
          return (
            <div
              key={idx}
              style={{
                width: `${segmentWidthPx}px`,
                height: `${segmentHeight}px`,
                backgroundColor: isLit ? color : '#eee',
                borderRadius: '2px',
                boxShadow: isLit ? `0 0 4px ${color}` : undefined,
                transition: 'background-color 0.2s',
              }}
            />
          );
        })}

        {reversedStages.map((stage, i) => {
          const stageProgress = getStageLeft(i);
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
                  backgroundColor: isCompleted ? '#3f0' : 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                  border: isCompleted ? 'none' : 'none',
                }}
              >
                {isCompleted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                    <polyline points="5 13 10 18 20 6" />
                  </svg>
                ) : (
                  <svg width="18" height="18">
                    <circle cx="9" cy="9" r="6" stroke="black" strokeWidth="3" fill="none" />
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
