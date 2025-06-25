
import { ReactNode } from 'react';

interface TaskCardLayoutProps {
  children: ReactNode;
  id: string;
  className?: string;
  isDimmed?: boolean;
}

const TaskCardLayout = ({
  children,
  id,
  className = '',
  isDimmed = false
}: TaskCardLayoutProps) => {
  const getCardClasses = () => {
    const baseClasses = `mx-auto font-arabic ${className}`;
    
    if (isDimmed) {
      return `${baseClasses} opacity-30 pointer-events-none`;
    }
    
    return baseClasses;
  };

  return (
    <div
      className={getCardClasses()}
      style={{
        width: '100%',
        maxWidth: '100%',
        height: '140px',
        backgroundColor: '#EAF2F5',
        borderRadius: '40px',
        padding: '16px',
        position: 'relative',
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'IBM Plex Sans Arabic',
        transition: 'all 0.3s ease'
      }}
    >
      {children}
    </div>
  );
};

export default TaskCardLayout;
