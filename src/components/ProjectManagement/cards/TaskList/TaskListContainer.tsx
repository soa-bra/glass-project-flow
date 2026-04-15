
import React, { ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskListContainerProps {
  children: ReactNode;
}

export const TaskListContainer: React.FC<TaskListContainerProps> = ({ children }) => {
  // فصل الهيدر عن المحتوى القابل للتمرير (مثل عامود المشاريع)
  const childArray = React.Children.toArray(children);
  const header = childArray[0];
  const scrollableContent = childArray.slice(1);

  return (
    <div 
      className="font-arabic h-full"
      style={{
        width: '100%',
        maxWidth: '100%',
        backgroundColor: '#eaecef',
        borderRadius: '24px',
        padding: '10px',
        position: 'relative',
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* شريط الأدوات ثابت في الأعلى */}
      <div className="flex-shrink-0">
        {header}
      </div>

      {/* منطقة التمرير للمهام مع تأثير النافذة الدائرية */}
      <div className="flex-1 overflow-hidden rounded-t-3xl">
        <ScrollArea className="h-full w-full">
          <div className="pb-4 px-0 mx-[2px]">
            {scrollableContent}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
