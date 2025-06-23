
import React, { ReactNode } from 'react';

interface TaskListContainerProps {
  children: ReactNode;
}

export const TaskListContainer: React.FC<TaskListContainerProps> = ({ children }) => {
  return (
    <div 
      style={{ background: '#e4f3f7' }} 
      className="h-full p-6 rounded-3xl"
    >
      {children}
    </div>
  );
};
