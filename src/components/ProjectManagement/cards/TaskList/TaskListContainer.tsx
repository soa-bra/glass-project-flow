
import React, { ReactNode } from 'react';

interface TaskListContainerProps {
  children: ReactNode;
}

export const TaskListContainer: React.FC<TaskListContainerProps> = ({ children }) => {
  return (
    <div 
      className="font-arabic h-full flex flex-col"
      style={{
        width: '100%',
        maxWidth: '100%',
        backgroundColor: '#eaecef',
        borderRadius: '40px',
        padding: '10px',
        position: 'relative',
        direction: 'rtl'
      }}
    >
      {children}
    </div>
  );
};
