
import React, { ReactNode } from 'react';

interface TaskListContainerProps {
  children: ReactNode;
}

export const TaskListContainer: React.FC<TaskListContainerProps> = ({ children }) => {
  return (
    <div 
      className="font-arabic h-full"
      style={{
        width: '100%',
        maxWidth: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: '40px',
        padding: '20px',
        position: 'relative',
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}
    >
      {children}
    </div>
  );
};
