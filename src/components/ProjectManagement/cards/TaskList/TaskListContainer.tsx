
import React, { ReactNode } from 'react';

interface TaskListContainerProps {
  children: ReactNode;
}

export const TaskListContainer: React.FC<TaskListContainerProps> = ({ children }) => {
  return (
    <div 
      style={{ background: '#aec2cf' }} 
      className="h-full p-4 rounded-3xl"
    >
      {children}
    </div>
  );
};
