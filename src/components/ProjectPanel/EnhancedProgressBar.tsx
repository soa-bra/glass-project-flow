
import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EnhancedProgressBarProps {
  totalSegments?: number;
  completedSegments?: number;
  inProgressSegments?: number;
}

export const EnhancedProgressBar: React.FC<EnhancedProgressBarProps> = ({
  totalSegments = 7,
  completedSegments = 3,
  inProgressSegments = 2
}) => {
  const segments = Array.from({ length: totalSegments }, (_, index) => {
    let status: 'completed' | 'inProgress' | 'pending' = 'pending';
    
    if (index < completedSegments) {
      status = 'completed';
    } else if (index < completedSegments + inProgressSegments) {
      status = 'inProgress';
    }
    
    return { index, status };
  });

  const getSegmentStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          background: '#00C853',
          borderColor: '#00C853'
        };
      case 'inProgress':
        return {
          background: 'linear-gradient(to right, #81D4FA, #7C4DFF)',
          borderColor: '#7C4DFF'
        };
      default:
        return {
          background: '#E0E0E0',
          borderColor: '#E0E0E0'
        };
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full h-12 flex items-center gap-1">
        {segments.map((segment) => (
          <Tooltip key={segment.index}>
            <TooltipTrigger asChild>
              <motion.div
                className="flex-1 h-full rounded-lg border-2 cursor-pointer"
                style={getSegmentStyle(segment.status)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  duration: 0.45,
                  stiffness: 180,
                  damping: 20,
                  delay: segment.index * 0.1
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-arabic">
                {segment.status === 'completed' ? 'مكتمل' : 
                 segment.status === 'inProgress' ? 'قيد التنفيذ' : 'في الانتظار'}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
