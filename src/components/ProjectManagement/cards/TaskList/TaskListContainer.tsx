
import React, { forwardRef } from 'react';

type TaskListContainerProps = React.HTMLAttributes<HTMLDivElement> & { 
  children: React.ReactNode 
};

export const TaskListContainer = forwardRef<HTMLDivElement, TaskListContainerProps>(
  ({ children, className = "", ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`font-arabic relative max-h-[calc(100vh-240px)] overflow-y-auto overscroll-contain scroll-smooth ${className}`}
      style={{
        width: '100%',
        maxWidth: '100%',
        backgroundColor: '#eaecef',
        borderRadius: '40px',
        padding: '10px',
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
