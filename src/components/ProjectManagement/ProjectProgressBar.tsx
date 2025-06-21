// ProjectProgressBar.tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Stage {
  label: string;
}

interface ProjectProgressBarProps {
  progress: number; // 0 - 100
  stages: Stage[];
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  progress,
  stages,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [segmentCount, setSegmentCount] = useState(60); // Initial fallback
  const stageCount = stages.length;

  const segmentWidth = 3; // px
  const segmentGap = 3; // px
  const trackHeight = 25; // px
  const stageDotSize = trackHeight * 1.3; // 30% bigger
  const bubbleSize = stageDotSize * 1.2;

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const count = Math.floor(containerWidth / (segmentWidth + segmentGap));
        setSegmentCount(count);
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const litCount = Math.round((segmentCount * progress) / 100);
  const segments = Array.from({ length: segmentCount }, (_, i) => i);

  const getStageLeft = (i: number) => {
    if (stageCount === 1) return '0%';
    const index = i / (stageCount - 1);
    const offset = 2 / segmentCount;
    const adjusted = index * (1 - 2 * offset) + offset;
    return `${adjusted * 100}%`;
  };

  const firstLitIndex = Math.floor((progress / 100) * (stageCount - 1));

  return (
    <div ref={containerRef} className="w-full select-none relative pt-10">
      {/* الشرائط */}
      <div className="relative flex overflow-hidden justify-start items-center">
        {segments.map((_, i) => {
          const isLit = i < litCount;
          const color =
            i < 2
              ? '#B9F3A8'
              : isLit
              ? `hsl(${(i / segmentCount) * 360}, 70%, 50%)`
              : '#e2e8f0';
          return (
            <motion.div
              key={i}
              className="rounded-sm"
              style={{
                width: `${segmentWidth}px`,
                height: `${trackHeight}px`,
                background: color,
                marginRight: `${segmentGap}px`,
              }}
            />
          );
        })}
      </div>

      {/* الدوائر الزجاجية */}
      <div
        className="absolute top-1/2 left-0 w-full pointer-events-none"
        style={{ transform: 'translateY(-50%)' }}
      >
        {stages.map((stage, i) => {
          const reached = progress >= (i / (stageCount - 1)) * 100;
          const left = getStageLeft(i);
          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{
                left,
                transform: 'translateX(-50%)',
              }}
            >
              <motion.div
                className={`flex items-center justify-center`}
                style={{
                  width: `${stageDotSize}px`,
                  height: `${stageDotSize}px`,
                  borderRadius: '50%',
                  border: reached ? 'none' : '2px solid black',
                  background: reached
                    ? '#B9F3A8'
                    : 'rgba(255,255,255,0.3)',
                  boxShadow: reached
                    ? '0 0 12px #B9F3A8'
                    : 'inset 0 0 6px rgba(0,0,0,0.3)',
                  color: reached ? 'black' : 'transparent',
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {reached ? '✓' : ''}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* الفقاعة اليمنى */}
      <div
        className="absolute"
        style={{
          top: `calc(50% - ${bubbleSize / 2}px)`,
          left: `calc(${getStageLeft(firstLitIndex)} - ${bubbleSize + 10}px)`,
          width: `${bubbleSize}px`,
          height: `${bubbleSize}px`,
          background: '#B9F3A8',
          borderRadius: '50%',
          boxShadow: '0 0 8px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 8,
        }}
      >
        <div className="text-center text-black text-xs leading-tight">
          <div className="font-bold">تقدم المشروع</div>
          <div className="text-[11px] font-light">
            {stages[firstLitIndex]?.label}
          </div>
        </div>
      </div>
    </div>
  );
};
