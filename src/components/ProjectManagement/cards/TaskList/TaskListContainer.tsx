import React, { ReactNode } from 'react';
interface TaskListContainerProps {
  children: ReactNode;
}
export const TaskListContainer: React.FC<TaskListContainerProps> = ({
  children
}) => {
  return <div style={{
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#aec2cf',
    borderRadius: '40px',
    padding: '20px',
    position: 'relative',
    direction: 'rtl',
    display: 'flex',
    flexDirection: 'column'
  }} className="font-arabic h-full bg-[aec2cf] rounded-lg">
      {children}
    </div>;
};