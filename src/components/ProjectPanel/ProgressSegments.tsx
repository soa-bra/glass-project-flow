
import React from 'react';

interface ProgressSegmentsProps {
  completedTasks: number;
  totalTasks: number;
  progressPercentage: number;
}

export const ProgressSegments: React.FC<ProgressSegmentsProps> = ({
  completedTasks,
  totalTasks,
  progressPercentage
}) => {
  const segments = 7; // 7 شرائح كما هو مطلوب
  const segmentWidth = 100 / segments; // 14.285%
  const filledSegments = Math.floor((progressPercentage / 100) * segments);
  const partialSegment = ((progressPercentage / 100) * segments) % 1;

  return (
    <div className="w-full">
      <div className="flex gap-1 mb-2">
        {Array.from({ length: segments }, (_, index) => {
          let segmentColor = 'bg-gray-200'; // الافتراضي
          
          if (index < filledSegments) {
            // شرائح مكتملة - أخضر
            segmentColor = 'bg-[#00C853]';
          } else if (index === filledSegments && partialSegment > 0) {
            // الشريحة الجارية - تدرج سماوي → بنفسجي
            segmentColor = 'bg-gradient-to-r from-sky-400 to-purple-500';
          }
          
          return (
            <div
              key={index}
              className={`h-3 rounded-full transition-all duration-500 ${segmentColor}`}
              style={{ 
                width: `${segmentWidth}%`,
                opacity: index === filledSegments && partialSegment > 0 ? partialSegment : 1
              }}
            />
          );
        })}
      </div>
      
      <div className="flex justify-between text-sm text-gray-600 font-arabic">
        <span>{completedTasks} من {totalTasks} مهمة مكتملة</span>
        <span>{progressPercentage}% مكتمل</span>
      </div>
    </div>
  );
};
