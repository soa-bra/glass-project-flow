
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
    let backgroundColor = '#EAF2F5';
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
      borderRadius: '32px',
      padding: '12px',
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

export default BaseTaskCardLayout;
