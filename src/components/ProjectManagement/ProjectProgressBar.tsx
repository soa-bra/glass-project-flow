import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Stage {
  label: string;
}

interface ProjectProgressBarProps {
  progress: number; // النسبة من 0 إلى 100
  stages: Stage[];
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  progress,
  stages
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [segmentCount, setSegmentCount] = useState(100);

  // مراقبة حجم الشريط لتحديث عدد الشرائح تلقائيًا
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const approx = Math.floor(width / 5); // كل شريحة 3px + 2px مسافة
        setSegmentCount(approx);
      }
    });

    if (barRef.current) observer.observe(barRef.current);

    return () => {
      if (barRef.current) observer.unobserve(barRef.current);
    };
  }, []);

  const litCount = Math.round((segmentCount * progress) / 100);
  const segments = Array.from({ length: segmentCount }, (_, i) => i);
  const segmentWidthPct = 100 / segmentCount;

  const getStageLeft = (index: number) =>
    (index / (stages.length - 1)) * 100;

  return (
    <div className="relative w-full p-6 overflow-visible">
      {/* فقّاعة تقدم المشروع */}
      <div className="absolute top-0 right-0 z-10 translate-x-[50%] -translate-y-2">
        <div className="bg-[#B9F3A8] text-black text-sm font-semibold px-4 py-2 rounded-full shadow">
          تقدم المشروع
        </div>
      </div>

      {/* الشريط نفسه */}
      <div ref={barRef} className="relative mx-auto" style={{ width: '80%' }}>
        {/* الشرائح */}
        <div className="flex items-center relative overflow-visible h-[25px]">
          {segments.map((idx) => {
            const isLit = idx < litCount;
            const hue = Math.round((360 * idx) / segmentCount);
            const color = `hsl(${hue}, 70%, 50%)`;

            return (
              <motion.div
                key={idx}
                className="rounded-[1px] mr-[2px] last:mr-0"
                style={{
                  height: '25px',
                  width: '3px',
                  backgroundColor: isLit ? color : '#e5e7eb',
                  opacity: isLit ? 1 : 0.3,
                }}
              />
            );
          })}
        </div>

        {/* الدوائر الزجاجية */}
        {stages.map((stage, i) => {
          const reached = progress >= (i / (stages.length - 1)) * 100;
          return (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${getStageLeft(i)}%`, transform: 'translate(-50%, -50%)' }}
            >
              <motion.div
                className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shadow-md ${
                  reached ? 'bg-[#B9F3A8] text-black' : 'bg-white text-black border'
                }`}
              >
                {reached ? '✓' : '●'}
              </motion.div>
              <div className="mt-1 text-center text-sm text-gray-700 font-medium whitespace-nowrap">
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
