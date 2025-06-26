
import { ReactNode } from 'react';

interface TaskCardLayoutProps {
  children: ReactNode;
  id: string;
  className?: string;
}

const TaskCardLayout = ({
  children,
  id,
  className = ''
}: TaskCardLayoutProps) => {
  return (
    <div
      className={`font-arabic ${className}`}
      style={{
        width: '100%',
        height: '140px',
        backgroundColor: '#EAF2F5',
        borderRadius: '40px',
        padding: '8px',
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'IBM Plex Sans Arabic'
      }}
    >
      {children}
    </div>
  );
};

export default TaskCardLayout;
