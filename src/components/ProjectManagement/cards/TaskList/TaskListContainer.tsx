
import React, { ReactNode } from 'react';

interface TaskListContainerProps {
  children: ReactNode;
}

export const TaskListContainer: React.FC<TaskListContainerProps> = ({ children }) => {
  return (
    <div 
      className="font-arabic h-full rounded-[41px] bg-[#FFFFFF] border border-[#DADCE0]"
      style={{
        width: '100%',
        maxWidth: '100%',
        padding: '10px',
        position: 'relative',
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {children}
    </div>
  );
};
