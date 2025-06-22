
import React from 'react';
interface Stage {
  label: string;
}
interface ProjectProgressBarProps {
  progress: number; // نسبة التقدم 0-100
  stages: Stage[];
}
export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  progress,
  stages
}) => {
  const segmentHeight = 25;
  const segmentWidth = 3;
  const segmentGap = 3;
  const segmentCount = Math.floor(window.innerWidth * 0.8 / (segmentWidth + segmentGap));
  const litCount = Math.round(progress / 100 * segmentCount);
  const segments = Array.from({
    length: segmentCount
  }, (_, i) => i);
  const stageCount = stages.length;
  const circleSize = segmentHeight * 1.3;
  const bubbleSize = circleSize * 1.2;
  const getStageLeft = (index: number) => (stageCount - 1 - index) / (stageCount - 1) * 100;
  return <div style={{
    background: 'transparent'
  }} className="relative w-full flex flex-col items-start font-arabic py-0 px-0">
      {/* الفقاعة */}
      <div className="absolute right-0 -top-10 z-10 text-black text-right" style={{
      background: 'linear-gradient(135deg, #B9F3A8, #d4ffd0)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '12px 16px',
      borderRadius: '28px',
      minWidth: '160px'
    }}>
        <div className="font-bold text-lg">تقدم المشروع</div>
        <div className="text-sm font-light text-gray-800">المعالجة الأولية</div>
      </div>

      {/* الشريط */}
      <div className="relative w-[80%] h-[25px] flex items-center justify-start flex-row-reverse" style={{
      gap: `${segmentGap}px`
    }}>
        {segments.map(idx => {
        const reversedIdx = segmentCount - 1 - idx;
        const hue = reversedIdx <= 1 ? null : reversedIdx / segmentCount * 360;
        const color = reversedIdx <= 1 ? '#B9F3A8' : `hsl(${hue}, 70%, 50%)`;
        return <div key={idx} style={{
          width: `${segmentWidth}px`,
          height: `${segmentHeight}px`,
          backgroundColor: (segmentCount - 1 - idx) < litCount ? color : '#eee',
          borderRadius: '2px',
          transition: 'background-color 0.2s'
        }} />;
      })}

        {/* مراحل (دوائر) */}
        {stages.map((stage, i) => {
        const reversedProgress = 100 - progress;
        const isReached = reversedProgress >= getStageLeft(i);
        const leftPct = getStageLeft(i);
        return <div key={i} className="absolute" style={{
          left: `calc(${leftPct}% - ${circleSize / 2}px)`,
          top: `-${(circleSize - segmentHeight) / 2}px`
        }}>
              <div className="flex items-center justify-center" style={{
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            borderRadius: '50%',
            backgroundColor: isReached ? '#B9F3A8' : 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(4px)',
            border: isReached ? 'none' : '2px solid black',
            boxShadow: isReached ? '0 0 6px #B9F3A8' : 'none'
          }}>
                {isReached ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="5 13 10 18 20 6" />
                  </svg> : null}
              </div>
              <div className="text-center mt-2 text-xs font-medium text-black">{stage.label}</div>
            </div>;
      })}
      </div>
    </div>;
};
