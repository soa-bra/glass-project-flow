
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
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const [segmentCount, setSegmentCount] = useState(50);
  
  // ثوابت التصميم
  const segmentWidthPx = 3;
  const segmentGapPx = 3;
  const segmentHeight = 25;
  const circleSize = 32; // حجم الدوائر
  const titleBubbleWidth = 180; // عرض فقاعة العنوان
  const spacing = 16; // المسافة بين العناصر

  useEffect(() => {
    const calculateLayout = () => {
      if (progressContainerRef.current) {
        const containerWidth = progressContainerRef.current.offsetWidth;
        
        // حساب العرض المتاح للشرائح والدوائر الوسطى
        // نطرح: عرض فقاعة العنوان + المسافات + عرض الدائرة الأولى + عرض الدائرة الأخيرة
        const reservedWidth = titleBubbleWidth + (spacing * 3) + (circleSize * 2);
        const availableForProgress = containerWidth - reservedWidth;
        
        setAvailableWidth(availableForProgress);
        
        // حساب عدد الشرائح بناءً على العرض المتاح
        const segmentsForBar = Math.floor(availableForProgress * 0.7 / (segmentWidthPx + segmentGapPx));
        setSegmentCount(Math.max(20, segmentsForBar)); // حد أدنى 20 شريحة
      }
    };

    calculateLayout();
    const resizeObserver = new ResizeObserver(calculateLayout);
    if (progressContainerRef.current) {
      resizeObserver.observe(progressContainerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);

  // حساب المرحلة الحالية
  const currentStageIndex = Math.floor((progress / 100) * (stages.length - 1));
  const litSegments = Math.round(segmentCount * progress / 100);

  // ألوان التدرج
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
    const localPosition = (position % segmentSize) / segmentSize;
    
    const colorIndex1 = Math.min(segmentIndex, mainColors.length - 1);
    const colorIndex2 = Math.min(segmentIndex + 1, mainColors.length - 1);
    
    return interpolateColor(mainColors[colorIndex1], mainColors[colorIndex2], localPosition);
  };

  // حساب مواضع الدوائر الوسطى
  const getMiddleCirclePositions = () => {
    if (stages.length <= 2) return [];
    
    const middleStages = stages.slice(1, -1); // استبعاد الأولى والأخيرة
    const middleCirclesWidth = availableWidth * 0.3; // 30% من العرض المتاح للدوائر الوسطى
    const step = middleCirclesWidth / (middleStages.length + 1);
    
    return middleStages.map((_, index) => ({
      stage: stages[index + 1],
      stageIndex: index + 1,
      position: step * (index + 1)
    }));
  };

  const middleCircles = getMiddleCirclePositions();

  return (
    <div className="relative w-full flex flex-col items-center font-arabic pt-16 pb-12" style={{ background: 'transparent' }}>
      {/* الحاوي الرئيسي - 90% من عرض الشاشة */}
      <div 
        ref={progressContainerRef}
        className="relative flex items-center w-[90%] min-h-[80px]"
        style={{ maxWidth: '1200px' }}
      >
        {/* فقاعة العنوان - ثابتة على اليسار */}
        <div
          className="absolute right-0 top-[-40px] z-10 text-black text-right flex-shrink-0"
          style={{
            background: '#b9f3a8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '14px 20px',
            borderRadius: '50px',
            width: `${titleBubbleWidth}px`,
          }}
        >
          <div className="font-bold text-lg">تقدم المشروع</div>
          <div className="text-sm font-light text-gray-800">{stages[currentStageIndex]?.label}</div>
        </div>

        {/* الدائرة الأولى - ثابتة بعد فقاعة العنوان */}
        <div
          className="absolute flex flex-col items-center z-20"
          style={{
            right: `${titleBubbleWidth + spacing}px`,
            top: `-${(circleSize - segmentHeight) / 2}px`
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              borderRadius: '50%',
              backgroundColor: progress > 0 ? '#b9f3a8' : 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(16px)',
              boxShadow: progress > 0 ? '0 0 6px #b9f3a8' : 'inset 0 0 2px rgba(0,0,0,0.25)',
            }}
          >
            {progress > 0 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                <polyline points="5 13 10 18 20 6" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                <circle cx="12" cy="12" r="8" />
              </svg>
            )}
          </div>
          <div
            className="text-center mt-2 font-medium text-black"
            style={{
              fontSize: '0.675rem',
              width: 'max-content',
              position: 'absolute',
              top: `${circleSize + 8}px`,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            {stages[0]?.label}
          </div>
        </div>

        {/* القسم الأوسط - شرائح التقدم والدوائر الوسطى */}
        <div
          className="absolute flex items-center"
          style={{
            right: `${titleBubbleWidth + spacing * 2 + circleSize}px`,
            width: `${availableWidth}px`,
            height: `${segmentHeight}px`
          }}
        >
          {/* شرائح التقدم */}
          <div className="flex items-center gap-[3px] flex-1">
            {Array.from({ length: segmentCount }, (_, idx) => {
              const isLit = idx < litSegments;
              const gradientPosition = idx / segmentCount;
              const color = isLit ? getGradientColor(gradientPosition) : '#eee';
              
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
          </div>

          {/* الدوائر الوسطى */}
          {middleCircles.map(({ stage, stageIndex, position }) => {
            const stageThreshold = (stageIndex / (stages.length - 1)) * 100;
            const isCompleted = progress >= stageThreshold;

            return (
              <div
                key={stageIndex}
                className="absolute flex flex-col items-center"
                style={{
                  right: `${position}px`,
                  top: `-${(circleSize - segmentHeight) / 2}px`,
                  transform: 'translateX(50%)'
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: `${circleSize}px`,
                    height: `${circleSize}px`,
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#b9f3a8' : 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: isCompleted ? '0 0 6px #b9f3a8' : 'inset 0 0 2px rgba(0,0,0,0.25)',
                  }}
                >
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
                <div
                  className="text-center mt-2 font-medium text-black"
                  style={{
                    fontSize: '0.675rem',
                    width: 'max-content',
                    position: 'absolute',
                    top: `${circleSize + 8}px`,
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* الدائرة الأخيرة - ثابتة على اليسار */}
        {stages.length > 1 && (
          <div
            className="absolute flex flex-col items-center z-20"
            style={{
              left: '0px',
              top: `-${(circleSize - segmentHeight) / 2}px`
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                borderRadius: '50%',
                backgroundColor: progress >= 100 ? '#b9f3a8' : 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(16px)',
                boxShadow: progress >= 100 ? '0 0 6px #b9f3a8' : 'inset 0 0 2px rgba(0,0,0,0.25)',
              }}
            >
              {progress >= 100 ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                  <polyline points="5 13 10 18 20 6" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                  <circle cx="12" cy="12" r="8" />
                </svg>
              )}
            </div>
            <div
              className="text-center mt-2 font-medium text-black"
              style={{
                fontSize: '0.675rem',
                width: 'max-content',
                position: 'absolute',
                top: `${circleSize + 8}px`,
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              {stages[stages.length - 1]?.label}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
