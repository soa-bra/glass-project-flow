
import { ReactNode, CSSProperties } from 'react';

interface BaseTaskCardLayoutProps {
  children: ReactNode;
  id: string;
  className?: string;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  isOtherSelected?: boolean;
}

const BaseTaskCardLayout = ({
  children,
  id,
  className = '',
  isSelected = false,
  isSelectionMode = false,
  isOtherSelected = false
}: BaseTaskCardLayoutProps) => {
  const getCardStyle = () => {
    let backgroundColor = 'var(--sb-task-card-bg)';
    let opacity = 1;
    
    if (isSelectionMode) {
      if (isSelected) {
        opacity = 1; // Selected card stays normal
      } else {
        opacity = 0.5; // Unselected cards are faded
      }
    }
    
    return {
      width: '100%',
      height: '120px',
      backgroundColor,
      borderRadius: '24px 24px 6px 6px',
      border: '1px solid var(--sb-border)',
      padding: '12px',
      direction: 'rtl',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: 'IBM Plex Sans Arabic',
      boxShadow: 'var(--sb-shadow-soft)',
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

export default BaseTaskCardLayout;
