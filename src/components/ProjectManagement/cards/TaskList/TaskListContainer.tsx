
import React, { ReactNode, useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
  daysLeft: number;
  priority: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important';
}

interface TaskListContainerProps {
  children: ReactNode;
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export const TaskListContainer: React.FC<TaskListContainerProps> = ({ children, tasks, onTasksChange }) => {
  return (
    <div 
      className="font-arabic h-full"
      style={{
        width: '100%',
        maxWidth: '100%',
        backgroundColor: '#aec2cf',
        borderRadius: '40px',
        padding: '20px',
        position: 'relative',
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { tasks, onTasksChange });
        }
        return child;
      })}
    </div>
  );
};
