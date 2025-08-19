
import React, { forwardRef } from 'react';

type TaskListContainerProps = React.HTMLAttributes<HTMLDivElement> & { 
  children: React.ReactNode 
};

export const TaskListContainer = forwardRef<HTMLDivElement, TaskListContainerProps>(
  ({ children, className = "", ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`font-arabic relative h-full ${className}`}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#eaecef',
        borderTopLeftRadius: '40px',
        borderTopRightRadius: '40px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        padding: '10px',
        paddingBottom: `max(10px, env(safe-area-inset-bottom, 0px))`,
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
