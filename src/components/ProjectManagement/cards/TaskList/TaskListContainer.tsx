
import React, { ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskListContainerProps {
  header: ReactNode;
  children: ReactNode;
}

export const TaskListContainer: React.FC<TaskListContainerProps> = ({ header, children }) => {
  return (
    <div className="font-arabic h-full flex flex-col overflow-hidden bg-panel rounded-[40px] p-2.5 relative" dir="rtl">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        {header}
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
