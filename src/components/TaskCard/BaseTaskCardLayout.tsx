
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
    let opacity = 1;
    
    if (isSelectionMode) {
      if (isSelected) {
        opacity = 1;
      } else {
        opacity = 0.5;
      }
    }
    
    return {
      width: '100%',
      height: '120px',
      backgroundColor: 'hsl(var(--oc-task-card-bg))',
      borderRadius: 'var(--ds-radius-card-top)',
      padding: 'var(--ds-spacing-md)',
      direction: 'rtl',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: 'var(--ds-font-family)',
      opacity,
      transition: 'var(--ds-transition-smooth)'
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
