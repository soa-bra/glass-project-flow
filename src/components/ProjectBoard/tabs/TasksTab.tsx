
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, MoreHorizontal, Calendar, DollarSign } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface TasksTabProps {
  project: ProjectCardProps;
}

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  value?: string;
  priority: 'low' | 'medium' | 'high';
}

const TasksTab: React.FC<TasksTabProps> = ({ project }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'تصميم واجهة المستخدم الرئيسية', status: 'in-progress', dueDate: '2025-01-20', value: '15,000 ر.س', priority: 'high' },
    { id: '2', title: 'برمجة نظام المصادقة', status: 'completed', dueDate: '2025-01-15', value: '8,000 ر.س', priority: 'medium' },
    { id: '3', title: 'اختبار الأمان والحماية', status: 'pending', dueDate: '2025-01-25', value: '12,000 ر.س', priority: 'high' },
    { id: '4', title: 'كتابة الوثائق التقنية', status: 'overdue', dueDate: '2025-01-10', priority: 'low' },
    { id: '5', title: 'مراجعة الكود النهائي', status: 'pending', dueDate: '2025-01-30', value: '5,000 ر.س', priority: 'medium' },
  ]);

  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed' | 'overdue'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': '#f59e0b',
      'in-progress': '#3b82f6', 
      'completed': '#22c55e',
      'overdue': '#ef4444'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'pending': 'في الانتظار',
      'in-progress': 'قيد التنفيذ',
      'completed': 'مكتملة',
      'overdue': 'متأخرة'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': '#10b981',
      'medium': '#f59e0b',
      'high': '#ef4444'
    };
    return colors[priority as keyof typeof colors] || '#6b7280';
  };

  const handleSwipeTask = (taskId: string, direction: 'left' | 'right') => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = direction === 'right' ? 'completed' : 'pending';
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => task.status === filter);

  const filters = [
    { key: 'all', label: 'الكل', count: tasks.length },
    { key: 'pending', label: 'في الانتظار', count: tasks.filter(t => t.status === 'pending').length },
    { key: 'in-progress', label: 'قيد التنفيذ', count: tasks.filter(t => t.status === 'in-progress').length },
    { key: 'completed', label: 'مكتملة', count: tasks.filter(t => t.status === 'completed').length },
    { key: 'overdue', label: 'متأخرة', count: tasks.filter(t => t.status === 'overdue').length },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            style={{ 
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full mx-4"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: 'inset 0 0 24px rgba(255,255,255,0.25)',
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white font-arabic mb-4">إضافة مهمة جديدة</h3>
              <input 
                className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 font-arabic mb-4"
                placeholder="عنوان المهمة"
              />
              <div className="flex gap-3">
                <button 
                  className="flex-1 py-3 bg-white/30 hover:bg-white/40 rounded-xl text-white font-arabic transition-colors"
                  onClick={() => setShowAddModal(false)}
                >
                  إضافة
                </button>
                <button 
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-arabic transition-colors"
                  onClick={() => setShowAddModal(false)}
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Add Task and Filters */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <motion.button 
            className="flex items-center gap-2 px-6 py-3 bg-white/30 hover:bg-white/40 rounded-full text-sm text-white font-arabic transition-all duration-200"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 1 }}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} strokeWidth={1.5} />
            إضافة مهمة جديدة
          </motion.button>
          
          <motion.button 
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white font-arabic transition-all duration-200"
            whileHover={{ scale: 1.05 }}
          >
            <Filter size={16} strokeWidth={1.5} />
            فلترة
          </motion.button>
        </div>

        <div className="text-sm text-white/80 font-arabic">
          {filteredTasks.length} من {tasks.length} مهام
        </div>
      </motion.div>

      {/* Filter Chips */}
      <motion.div 
        className="flex items-center gap-2 mb-6 overflow-x-auto"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
      >
        {filters.map((filterItem, index) => (
          <motion.button
            key={filterItem.key}
            onClick={() => setFilter(filterItem.key as any)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-arabic transition-all duration-200 whitespace-nowrap
              ${filter === filterItem.key 
                ? 'bg-white/40 text-white border border-white/60' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
              }
            `}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (index * 0.03) }}
            whileHover={{ scale: 1.05 }}
          >
            {filterItem.label}
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {filterItem.count}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                delay: index * 0.03,
                duration: 0.3,
                ease: [0.45, 0, 0.55, 1]
              }}
              className="rounded-3xl backdrop-blur-3xl bg-white/30 p-4 border border-white/20 hover:bg-white/35 transition-all duration-200 cursor-pointer group"
              style={{
                borderRight: `4px solid ${getStatusColor(task.status)}`,
                backdropFilter: 'blur(14px)',
                boxShadow: 'inset 0 0 16px rgba(255,255,255,0.15)',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              drag="x"
              dragConstraints={{ left: -100, right: 100 }}
              onDragEnd={(event, info) => {
                if (info.offset.x > 50) {
                  handleSwipeTask(task.id, 'right');
                } else if (info.offset.x < -50) {
                  handleSwipeTask(task.id, 'left');
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-arabic font-medium text-lg group-hover:text-white/90">
                      {task.title}
                    </h3>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span className="font-arabic">{task.dueDate}</span>
                    </div>
                    {task.value && (
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        <span className="font-arabic">{task.value}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <motion.div
                    className="px-3 py-1 rounded-full text-xs font-arabic border"
                    style={{ 
                      backgroundColor: `${getStatusColor(task.status)}20`,
                      borderColor: `${getStatusColor(task.status)}40`,
                      color: getStatusColor(task.status)
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {getStatusLabel(task.status)}
                  </motion.div>

                  <motion.button 
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MoreHorizontal size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Swipe indicators */}
              <div className="absolute top-4 left-4 text-green-400 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
                ← سحب للإنجاز
              </div>
              <div className="absolute top-4 right-4 text-yellow-400 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
                سحب للتعليق →
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <motion.div 
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center text-white/60">
            <div className="text-lg font-arabic mb-2">لا توجد مهام</div>
            <div className="text-sm">جرب تغيير الفلتر أو إضافة مهمة جديدة</div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TasksTab;
