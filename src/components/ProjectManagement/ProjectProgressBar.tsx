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
  stages,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [segmentCount, setSegmentCount] = useState(100);

  const segmentWidthPx = 3;
  const segmentGapPx = 3;
  const segmentHeight = 20;

  const circleSize = segmentHeight * 1.3;
  const bubbleSize = circleSize * 1.2;

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

  const firstIdx = 1;
  const lastIdx = segmentCount - 2;

  const reversedStages = [...stages].reverse();

  const circlePositions = reversedStages.map((_, i) => {
    const ratio = i / (stages.length - 1);
    const idx = firstIdx + ratio * (lastIdx - firstIdx);
    return Math.round(idx);
  });

  const currentStageIndex = Math.floor((progress / 100) * (stages.length - 1));
  const reversedIndex = stages.length - 1 - currentStageIndex;
  const circleColor = '#B9F3A8';

  return (
    <div className="relative w-full px-10 pt-10 pb-14">
      {/* فقاعة تقدم المشروع */}
      <div
        className="absolute bg-[#B9F3A8] text-black rounded-full text-sm font-bold shadow-md z-10 px-[30px] py-[10px]"
        style={{
          top: 0,
          left: `calc(${(circlePositions[reversedIndex] / segmentCount) * 100}% - ${bubbleSize + 12}px)`,
          transform: 'translateY(-50%)',
        }}
      >
        <div>تقدم المشروع</div>
        <div className="text-xs font-light">
          {stages[currentStageIndex]?.label}
        </div>
      </div>

      {/* الشريط الرئيسي */}
      <div ref={barRef} className="relative flex items-center gap-[3px]">
        {segments.map((idx) => {
          const isFirstTwo = idx <= 1;
          const isLit = idx < litCount;
          const baseColor = isFirstTwo
            ? '#B9F3A8'
            : `hsl(${(idx / segmentCount) * 360}, 70%, 50%)`;
          return (
            <motion.div
              key={idx}
              className="rounded-sm"
              style={{
                width: segmentWidthPx,
                height: segmentHeight,
                backgroundColor: isLit ? baseColor : '#ddd',
                boxShadow: isLit ? `0 0 6px ${baseColor}` : undefined,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          );
        })}

        {/* الدوائر الزجاجية */}
        {circlePositions.map((posIdx, i) => {
          const reached = i <= reversedIndex;
          return (
            <div
              key={`circle-${i}`}
              className="absolute"
              style={{
                left: `${(posIdx / segmentCount) * 100}%`,
                top: `-${(circleSize - segmentHeight) / 2}px`,
                transform: 'translateX(-50%)',
                width: circleSize,
                height: circleSize,
                background: reached ? circleColor : 'transparent',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
                boxShadow: reached
                  ? '0 0 10px #B9F3A8'
                  : 'inset 0 0 0 2px black',
                zIndex: 5,
              }}
            >
              {reached && (
                <div
                  style={{
                    transform: 'rotate(90deg)',
                    fontWeight: 800,
                    fontSize: '16px',
                    color: 'black',
                  }}
                >
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
