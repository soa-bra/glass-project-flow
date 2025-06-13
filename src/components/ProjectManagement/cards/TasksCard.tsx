
import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, CheckCircle, Circle } from 'lucide-react';
import { TaskItem } from './TaskItem';

const initialTasks = [
  { id: '1', title: 'تصميم واجهة المستخدم', completed: true, priority: 'high' },
  { id: '2', title: 'تطوير صفحة الرئيسية', completed: false, priority: 'high' },
  { id: '3', title: 'إضافة نظام المصادقة', completed: false, priority: 'medium' },
  { id: '4', title: 'اختبار الوظائف', completed: false, priority: 'low' },
  { id: '5', title: 'مراجعة الكود', completed: false, priority: 'medium' }
];

export const TasksCard: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const completedCount = tasks.filter(task => task.completed).length;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      // يمكن إضافة منطق إعادة الترتيب هنا
      console.log('تم نقل المهمة من', active.id, 'إلى', over?.id);
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        priority: 'medium' as const
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setShowAddTask(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* العنوان والإحصائيات */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">المهام</h3>
        <div className="text-sm text-gray-600 font-arabic">
          {completedCount}/{tasks.length} مكتملة
        </div>
      </div>

      {/* شريط التقدم */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* قائمة المهام */}
      <div className="flex-1 overflow-y-auto">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* إضافة مهمة جديدة */}
      <div className="mt-4 pt-4 border-t border-white/20">
        {showAddTask ? (
          <div className="space-y-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="عنوان المهمة الجديدة..."
              className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg
                       text-gray-800 placeholder-gray-500 font-arabic text-right
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddTask(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 font-arabic"
              >
                إلغاء
              </button>
              <button
                onClick={addTask}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md
                         hover:bg-blue-600 font-arabic"
              >
                إضافة
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg
                     text-gray-600 hover:text-gray-800 hover:border-gray-400
                     transition-colors duration-200 flex items-center justify-center gap-2
                     font-arabic"
          >
            <Plus size={16} />
            إضافة مهمة جديدة
          </button>
        )}
      </div>
    </div>
  );
};
