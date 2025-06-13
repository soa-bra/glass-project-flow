
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignee: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

interface TasksTabProps {
  project: ProjectCardProps;
  tint: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'تصميم واجهة المستخدم الرئيسية',
    description: 'إنشاء التصميم الأولي للصفحة الرئيسية',
    status: 'in-progress',
    assignee: 'أحمد محمد',
    deadline: '2025-01-20',
    priority: 'high'
  },
  {
    id: '2', 
    title: 'برمجة نظام المصادقة',
    description: 'تطوير نظام تسجيل الدخول والحماية',
    status: 'pending',
    assignee: 'سارة أحمد',
    deadline: '2025-01-25',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'اختبار الأداء',
    description: 'فحص سرعة الموقع وتحسين الأداء',
    status: 'completed',
    assignee: 'محمد علي',
    deadline: '2025-01-15',
    priority: 'low'
  }
];

export const TasksTab: React.FC<TasksTabProps> = ({ project, tint }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} className="text-green-600" />;
      case 'in-progress': return <Clock size={16} className="text-blue-600" />;
      case 'overdue': return <AlertCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div 
      className="h-full p-6 overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Search and Filter Bar */}
      <motion.div 
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex-1 relative">
          <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في المهام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-white/30 border border-white/20 rounded-full text-sm font-arabic placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-full text-sm font-arabic text-gray-700 transition-colors border border-white/20">
          <Filter size={16} />
          تصفية
        </button>
        <button 
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-arabic text-white transition-colors"
          style={{ backgroundColor: tint }}
        >
          <Plus size={16} />
          مهمة جديدة
        </button>
      </motion.div>

      {/* Tasks List */}
      <div className="h-[calc(100%-100px)] overflow-y-auto space-y-3">
        {mockTasks.map((task, index) => (
          <motion.div
            key={task.id}
            className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/30 transition-all duration-200 cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.2 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(task.status)}
                <div>
                  <h3 className="text-base font-semibold font-arabic text-gray-800">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-arabic mt-1">
                    {task.description}
                  </p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded-full text-xs font-arabic border ${getStatusColor(task.status)}`}>
                  {task.status === 'completed' ? 'مكتملة' : 
                   task.status === 'in-progress' ? 'قيد التنفيذ' :
                   task.status === 'overdue' ? 'متأخرة' : 'في الانتظار'}
                </span>
                <span className="text-sm text-gray-600 font-arabic">
                  {task.assignee}
                </span>
              </div>
              <span className="text-sm text-gray-500 font-arabic">
                {task.deadline}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
