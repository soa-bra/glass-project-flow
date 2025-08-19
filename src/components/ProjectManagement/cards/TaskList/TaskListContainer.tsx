
import React, { forwardRef } from 'react';

type TaskListContainerProps = React.HTMLAttributes<HTMLDivElement> & { 
  children: React.ReactNode 
};

export const TaskListContainer = forwardRef<HTMLDivElement, TaskListContainerProps>(
  ({ children, className = "", ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`font-arabic relative h-[calc(100vh-200px)] ${className}`}
      style={{
        width: '100%',
        maxWidth: '100%',
        backgroundColor: '#eaecef',
        borderTopLeftRadius: '40px',
        borderTopRightRadius: '40px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        padding: '10px',
        paddingBottom: '0px',
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {children}
    </div>
  )
);

TaskListContainer.displayName = 'TaskListContainer';
