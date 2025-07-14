
import { ReactNode, CSSProperties } from 'react';

interface TaskCardLayoutProps {
  children: ReactNode;
  id: string;
  className?: string;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  isOtherSelected?: boolean;
}

const TaskCardLayout = ({
  children,
  id,
  className = '',
  isSelected = false,
  isSelectionMode = false,
  isOtherSelected = false
}: TaskCardLayoutProps) => {
  const getCardStyle = () => {
    let backgroundColor = '#EAF2F5';
    let opacity = 1;
    
    if (isSelectionMode) {
      if (isSelected) {
        backgroundColor = '#EAF2F5'; // Keep normal color for selected
      } else if (isOtherSelected) {
        opacity = 0.5; // Fade out unselected cards when others are selected
      }
    }
    
    return {
      width: '100%',
      height: '140px',
      backgroundColor,
      borderRadius: '40px',
      padding: '8px',
      direction: 'rtl',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: 'IBM Plex Sans Arabic',
      opacity,
      transition: 'opacity 0.2s ease-in-out'
    } as CSSProperties;
  };

  return (
    <div
      className={`font-arabic ${className}`}
      style={getCardStyle()}
    >
      {children}
    </div>
  );
};

export default TaskCardLayout;
