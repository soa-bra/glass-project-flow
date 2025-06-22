import React, { useState } from 'react';
import { HiPlus, HiStar, HiArrowLeft } from 'react-icons/hi';
import { ScrollArea } from '@/components/ui/scroll-area';
import TaskCard from './TaskCard';

  {
    id: 1,
    title: 'تصميم الواجهة',
    description: 'تطوير موقع سوبرا',
    dueDate: '28 May',
  },
  {
    id: 2,
    title: 'كتابة الكود',
    description: 'تطوير موقع سوبرا',
    dueDate: '29 May'
  },
];

const TaskColumn: React.FC = () => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  return (
    <>
      <div
        className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl mx-0"
        style={{
          background: 'var(--backgrounds-project-column-bg)',
        }}
      >
        {/* رأس العمود */}
        <div className="flex-shrink-0 px-4 pt-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">قائمة المهام</h2>
            <div className="flex gap-2 text-gray-600">
              <button><HiPlus onClick={() => setShowAddTaskModal(true)} /></button>
              <button><HiStar /></button>
              <button><HiArrowLeft /></button>
            </div>
          </div>
        </div>

        {/* منطقة التمرير لبطاقات المهام */}
        <div className="flex-1 overflow-hidden rounded-t-3xl">
          <ScrollArea className="h-full w-full">
            <div className="space-y-4 pb-4 px-0 rounded-full mx-[10px]">
              {tasks.map(task => (
                <TaskCard key={task.id} {...task} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* نافذة إضافة مهمة - placeholder حالياً */}
      {/* <AddTaskModal isOpen={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} /> */}
    </>
  );
};

export default TaskColumn;
