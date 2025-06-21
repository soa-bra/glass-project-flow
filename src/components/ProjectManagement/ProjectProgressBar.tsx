import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Stage {
  label: string;
}

interface ProjectProgressBarProps {
  progress: number;
  stages: Stage[];
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({ progress, stages }) => {
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

  const circleSize = segmentHeight * 1.3;
  const firstIdx = 1;
  const lastIdx = segmentCount - 2;

  const circlePositions = stages.map((_, i) => {
    const ratio = i / (stages.length - 1);
    const idx = firstIdx + ratio * (lastIdx - firstIdx);
    return Math.round(idx);
  });

  const currentStageIndex = Math.floor((progress / 100) * (stages.length - 1));
  const circleColor = '#B9F3A8';

  return (
    <div className="relative w-full px-0 pt-10 pb-14">
      {/* العنوان والفقاعة */}
      <div className="absolute right-0 top-0 bg-[#B9F3A8] text-black px-0 py-0 rounded-full text-sm font-bold shadow-md z-10">
        <div>تقدم المشروع</div>
        <div className="text-xs font-light">{stages[currentStageIndex]?.label}</div>
      </div>

      {/* الشريط الرئيسي */}
      <div ref={barRef} className="relative flex items-center gap-[3px]">
        {segments.map((idx) => {
          const isFirstTwo = idx <= 1;
          const isLit = idx < litCount;
          const isStage = circlePositions.includes(idx);

          const baseColor = isFirstTwo ? '#B9F3A8' : `hsl(${(idx / segmentCount) * 360}, 70%, 50%)`;

          return (
            <div key={idx} className="relative">
              <motion.div
                className="rounded-sm"
                style={{
                  width: segmentWidthPx,
                  height: segmentHeight,
                  backgroundColor: isLit ? baseColor : '#ddd',
                  boxShadow: isLit
                    ? `0 0 6px ${baseColor}`
                    : undefined,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          );
        })}
        {/* دوائر المراحل */}
        {circlePositions.map((posIdx, i) => {
          const reached = i <= currentStageIndex;
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
                border: reached ? 'none' : '2px solid black',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 0 8px rgba(0,0,0,0.1), inset 0 0 6px rgba(0,0,0,0.2)',
                zIndex: 5,
              }}
            >
              {reached && (
                <div
                  style={{
                    transform: 'rotate(90deg)',
                    fontWeight: 800,
                    fontSize: '18px',
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
