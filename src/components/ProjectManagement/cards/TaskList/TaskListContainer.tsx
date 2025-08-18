
import React, { ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskListContainerProps {
  children: ReactNode;
}

export const TaskListContainer: React.FC<TaskListContainerProps> = ({ children }) => {
  // فصل الهيدر عن المحتوى
  const childrenArray = React.Children.toArray(children);
  const header = childrenArray[0]; // TaskListHeader
  const content = childrenArray[1]; // TaskListContent

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl mx-0 font-arabic"
      style={{
        background: '#eaecef',
        direction: 'rtl'
      }}
    >
      {/* الهيدر ثابت في الأعلى */}
      <div className="flex-shrink-0 px-4 pt-4">
        <div className="mb-4">
          {header}
        </div>
      </div>
      
      {/* منطقة التمرير للمهام */}
      <div className="flex-1 overflow-hidden">
        {content}
      </div>
    </div>
  );
};
