import React, { useState, useEffect } from 'react';

interface FloatingCommentIconProps {
  onActivate: () => void;
  duration: number; // Duration in milliseconds
}

export const FloatingCommentIcon: React.FC<FloatingCommentIconProps> = ({ 
  onActivate, 
  duration 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Show the icon after a delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      
      // Hide after specified duration
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      setTimer(hideTimer);
    }, 3000); // Show after 3 seconds

    return () => {
      clearTimeout(showTimer);
      if (timer) clearTimeout(timer);
    };
  }, [duration]);

  const handleClick = () => {
    onActivate();
    setIsVisible(false);
    if (timer) clearTimeout(timer);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="absolute -top-2 -right-2 w-8 h-8 bg-[#a4e2f6] rounded-full flex items-center justify-center cursor-pointer shadow-lg animate-bounce hover:scale-110 transition-transform"
      onClick={handleClick}
    >
      <span className="text-sm">💬</span>
    </div>
  );
};