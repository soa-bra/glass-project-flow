import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Stage {
  label: string;
}

interface ProjectProgressBarProps {
  progress: number;
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

  const litCount = Math.round((segmentCount * progress) / 100);
  const segments = Array.from({ length: segmentCount }, (_, i) => i);

  const stageCount = stages.length;
  const circleSize = segmentHeight * 1.3 * 1.2;
  const firstIdx = 1;
  const lastIdx = segmentCount - 2;

  const circlePositions = stages.map((_, i) => {
    const ratio = i / (stageCount - 1);
    const idx = firstIdx + ratio * (lastIdx - firstIdx);
    return Math.round(idx);
  });

  const currentStageIndex = Math.floor((progress / 100) * (stageCount - 1));
  const circleColor = '#B9F3A8';

  return (
    <div className="relative w-full px-10 pt-10 pb-14 font-arabic">
      {/* فقاعة العنوان */}
      <div
        className="absolute right-0 top-0 text-black rounded-full text-sm font-bold shadow-md z-10 px-[30px] py-[10px]"
        style={{
          background: 'linear-gradient(135deg, #B9F3A8, #d4ffd0)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minWidth: '160px',
        }}
      >
        <div className="font-bold text-lg">تقدم المشروع</div>
        <div className="text-xs font-light">
          {progress >= 100 ? 'مكتمل' : stages[currentStageIndex]?.label}
        </div>
      </div>

      {/* الشريط */}
      <div
        ref={barRef}
        className="relative flex flex-row-reverse items-center"
        style={{ gap: `${segmentGapPx}px` }}
      >
        {segments.map((idx) => {
          const reversedIdx = segmentCount - 1 - idx;
          const isLit = reversedIdx < litCount;
          const isFirstTwo = reversedIdx <= 1;
          const hue = reversedIdx / segmentCount * 360;
          const baseColor = isFirstTwo ? '#B9F3A8' : `hsl(${hue}, 70%, 50%)`;
          return (
            <motion.div
              key={idx}
              className="rounded-sm"
              style={{
                width: segmentWidthPx,
                height: segmentHeight,
                backgroundColor: isLit ? baseColor : '#eee',
                boxShadow: isLit ? `0 0 6px ${baseColor}` : undefined,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          );
        })}

        {/* دوائر المراحل */}
        {stages.map((stage, i) => {
          const posIdx = circlePositions[i];
          const reversedPos = segmentCount - 1 - posIdx;
          const isCompleted = reversedPos < litCount;

          return (
            <div
              key={`circle-${i}`}
              className="absolute"
              style={{
                left: `calc(${(1 - i / (stageCount - 1)) * 100}% - ${circleSize / 2}px)`,
                top: `-${(circleSize - segmentHeight) / 2}px`,
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: `${circleSize}px`,
                  height: `${circleSize}px`,
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? circleColor : 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(20px)',
                  border: isCompleted ? 'none' : '2px solid black',
                  boxShadow: isCompleted
                    ? '0 0 6px #B9F3A8'
                    : 'inset 0 0 4px rgba(0,0,0,0.15)',
                }}
              >
                {isCompleted ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    style={{ transform: 'rotate(90deg)' }}
                  >
                    <polyline points="5 13 10 18 20 6" />
                  </svg>
                ) : (
                  <span style={{ fontSize: '18px', color: 'black', fontWeight: 'bold' }}>◯</span>
                )}
              </div>

              {/* تسمية المرحلة */}
              <div
                className="text-center font-medium text-black"
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