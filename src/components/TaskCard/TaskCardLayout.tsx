
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
    let border = 'none';
    let boxShadow = 'none';
    
    if (isSelectionMode) {
      if (isSelected) {
        backgroundColor = '#E8F4FD'; // لون مختلف للبطاقة المحددة
        border = '2px solid #3B82F6'; // حدود زرقاء للبطاقة المحددة
        boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'; // ظل أزرق
        opacity = 1;
      } else {
        opacity = 0.6; // البطاقات غير المحددة أكثر شفافية
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
      border,
      boxShadow,
      transition: 'all 0.2s ease-in-out'
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
