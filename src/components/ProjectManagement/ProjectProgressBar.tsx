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
  const circleSize = segmentHeight * 1.3 * 1.2;
  const bubbleSize = circleSize * 1.2;

  const currentStageIndex = Math.floor(progress / 100 * (stages.length - 1));
  const reversedStages = [...stages].reverse();

  const getStageLeft = (index: number) => {
    const usableWidth = segmentCount - 4;
    const step = usableWidth / (stages.length - 1);
    return (index * step + 2) / segmentCount * 100;
  };

  const mainColors = ['#d9f3a8', '#5ac0d8', '#d9d2fd', '#fba0a3', '#fbe2aa'];

  const interpolateColor = (color1: string, color2: string, factor: number) => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const getGradientColor = (position: number) => {
    const segmentSize = 1 / (mainColors.length - 1);
    const segmentIndex = Math.floor(position / segmentSize);
    const localPosition = position % segmentSize / segmentSize;
    const colorIndex1 = Math.min(segmentIndex, mainColors.length - 1);
    const colorIndex2 = Math.min(segmentIndex + 1, mainColors.length - 1);
    return interpolateColor(mainColors[colorIndex1], mainColors[colorIndex2], localPosition);
  };

  return (
    <div style={{ background: 'transparent' }} className="relative w-full flex flex-row-reverse items-center font-arabic pt-0 pb-0 py-[4px] my-[30px] px-[35px] mx-[148px]">
      
      {/* شريط الشرائح */}
      <div ref={barRef} className="relative flex items-center justify-start flex-row-reverse gap-[3px] w-[80%] h-[25px]">
        {segments.map(idx => {
          const reversedIdx = segmentCount - 1 - idx;
          const isLit = reversedIdx < litCount;
          const isFirstTwo = reversedIdx >= segmentCount - 2;
          let color = '#eee';
          if (isFirstTwo) {
            color = '#d9f3a8';
          } else if (isLit) {
            const gradientPosition = reversedIdx / segmentCount;
            color = getGradientColor(gradientPosition);
          }
          return (
            <div key={idx} style={{
              width: `${segmentWidthPx}px`,
              height: `${segmentHeight}px`,
              backgroundColor: color,
              borderRadius: '2px',
              boxShadow: isLit ? `0 0 4px ${color}` : undefined,
              transition: 'background-color 0.2s'
            }} />
          );
        })}

        {/* دوائر المراحل */}
        {reversedStages.map((stage, i) => {
          const stageProgress = getStageLeft(i);
          const originalStageIndex = stages.length - 1 - i;
          const stageThreshold = originalStageIndex / (stages.length - 1) * 100;
          const isCompleted = progress >= stageThreshold;
          return (
            <div key={i} className="absolute" style={{
              left: `calc(${stageProgress}% - ${circleSize / 2}px)`,
              top: `-${(circleSize - segmentHeight) / 2}px`
            }}>
              <div className="flex items-center justify-center" style={{
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                borderRadius: '50%',
                backgroundColor: isCompleted ? '#b9f3a8' : 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(16px)',
                border: 'none',
                boxShadow: isCompleted ? '0 0 6px #b9f3a8' : 'inset 0 0 2px rgba(0,0,0,0.25)'
              }}>
                {isCompleted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                    <polyline points="5 13 10 18 20 6" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                )}
              </div>
              <div className="text-center mt-2 font-medium text-black" style={{
                fontSize: '0.675rem',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'max-content',
                top: `${circleSize + 8}px`
              }}>
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* فقاعة المرحلة الحالية */}
      {stages[currentStageIndex] && (
        <div className="flex items-center gap-3 ml-[30px]">
          <div style={{
            width: `${bubbleSize}px`,
            height: `${bubbleSize}px`,
            borderRadius: '50%',
            backgroundColor: '#d9f3a8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px #d9f3a8'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
              <polyline points="5 13 10 18 20 6" />
            </svg>
          </div>

          <div style={{
            backgroundColor: '#d9f3a8',
            borderRadius: '999px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#000',
            lineHeight: 1.4,
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap'
          }}>
            مقياس مراحل تقدم المشروع<br />
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 'normal',
              color: '#444'
            }}>
              الحالة الحالية: {stages[currentStageIndex].label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
