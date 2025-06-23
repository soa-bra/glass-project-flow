
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
      className={`mx-auto font-arabic ${className}`}
      style={{
        width: '100%',
        maxWidth: '360px',
        minHeight: '150px',
        backgroundColor: '#EAF2F5',
        borderRadius: '32px',
        padding: '14px',
        position: 'relative',
        direction: 'rtl'
      }}
    >
      {children}
    </div>
  );
};

export default TaskCardLayout;
