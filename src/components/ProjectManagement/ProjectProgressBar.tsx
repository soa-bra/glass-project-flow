// ProjectProgressBar.tsx

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Stage {
  label: string;
}

interface ProjectProgressBarProps {
  progress: number; // من 0 إلى 100
  stages: Stage[];
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  progress,
  stages,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [segmentCount, setSegmentCount] = useState(100);

  useEffect(() => {
    const updateCount = () => {
      const containerWidth = containerRef.current?.offsetWidth || 800;
      const segmentWidth = 3 + 3; // عرض الشريحة + المسافة
      const count = Math.floor(containerWidth * 0.8 / segmentWidth);
      setSegmentCount(count);
    };

    updateCount();
    const resizeObserver = new ResizeObserver(updateCount);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const litCount = Math.round((segmentCount * progress) / 100);
  const segments = Array.from({ length: segmentCount }, (_, i) => i);
  const segmentWidthPct = 100 / segmentCount;
  const segmentHeight = 25;
  const segmentGap = 3;

  const getStageLeft = (index: number) =>
    ((index / (stages.length - 1)) * (segmentCount - 2) + 1) * segmentWidthPct;

  return (
    <div ref={containerRef} className="p-6">
      <div className="relative w-full h-[80px] flex items-center justify-center">

        {/* الشريط الرئيسي */}
        <div className="w-[80%] h-[25px] flex items-center relative overflow-visible">
          {segments.map((idx) => {
            const isLit = idx < litCount;
            const isStaticLit = idx === 0 || idx === 1;
            const baseColor = isStaticLit
              ? '#B9F3A8'
              : isLit
              ? `hsl(${Math.round((idx / segmentCount) * 360)}, 70%, 60%)`
              : 'transparent';

            return (
              <motion.div
                key={idx}
                className="rounded-sm"
                style={{
                  height: segmentHeight,
                  width: 3,
                  marginRight: idx === segmentCount - 1 ? 0 : segmentGap,
                  backgroundColor: baseColor,
                  boxShadow: isLit ? '0 0 6px rgba(0,0,0,0.1)' : 'none',
                  transition: 'background-color 0.2s ease',
                }}
              />
            );
          })}

          {/* الدوائر الزجاجية */}
          {stages.map((stage, i) => {
            const stageProgress = (i / (stages.length - 1)) * 100;
            const reached = progress >= stageProgress;
            const left = getStageLeft(i);

            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${left}%`,
                  transform: 'translate(-50%, -50%)',
                  top: '-25px',
                }}
              >
                <div
                  className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-black ${
                    reached ? 'bg-[#B9F3A8]' : 'bg-[#ffffff20] border border-[#B9F3A8]'
                  }`}
                  style={{
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  {reached ? '✓' : ''}
                </div>
              </div>
            );
          })}
        </div>

        {/* فقاعة تقدم المشروع */}
        <div className="absolute right-[10%] top-[-70px]">
          <div
            className="rounded-full px-6 py-3 text-center shadow-md"
            style={{
              backgroundColor: '#B9F3A8',
              minWidth: '160px',
            }}
          >
            <div className="text-black font-bold text-sm">تقدم المشروع</div>
            <div className="text-black font-light text-xs mt-1">
              {stages[Math.floor((progress / 100) * (stages.length - 1))].label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
