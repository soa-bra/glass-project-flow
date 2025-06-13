
import React, { useState } from 'react';
import { TaskData } from './types';
import { TaskCard } from './TaskCard';
import { Search, Filter, Plus, Zap, Grid, List } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface TasksTabProps {
  tasks: TaskData[];
  loading: boolean;
}

export const TasksTab: React.FC<TasksTabProps> = ({ tasks: initialTasks, loading }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/20 backdrop-blur-[10px] rounded-[20px] p-4 animate-pulse">
            <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/30 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* شريط الأدوات */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في المهام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-white/20 backdrop-blur-[10px] border border-white/30 rounded-full text-right placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-white/20 backdrop-blur-[10px] border border-white/30 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">كل المهام</option>
          <option value="pending">قيد الانتظار</option>
          <option value="in_progress">قيد التنفيذ</option>
          <option value="completed">مكتمل</option>
        </select>

        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          {viewMode === 'list' ? <Grid size={16} /> : <List size={16} />}
        </button>
        
        <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
          <Filter size={16} className="text-gray-600" />
        </button>
        
        <button className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors">
          <Plus size={16} />
        </button>
        
        <button className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors">
          <Zap size={16} />
        </button>
      </div>

      {/* إحصائيات المهام */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-white/20 backdrop-blur-[10px] rounded-[15px] p-3 text-center border border-white/30">
          <div className="text-lg font-bold text-gray-800">{tasks.length}</div>
          <div className="text-xs text-gray-600">إجمالي المهام</div>
        </div>
        <div className="bg-white/20 backdrop-blur-[10px] rounded-[15px] p-3 text-center border border-white/30">
          <div className="text-lg font-bold text-blue-600">{tasks.filter(t => t.status === 'in_progress').length}</div>
          <div className="text-xs text-gray-600">قيد التنفيذ</div>
        </div>
        <div className="bg-white/20 backdrop-blur-[10px] rounded-[15px] p-3 text-center border border-white/30">
          <div className="text-lg font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</div>
          <div className="text-xs text-gray-600">مكتمل</div>
        </div>
        <div className="bg-white/20 backdrop-blur-[10px] rounded-[15px] p-3 text-center border border-white/30">
          <div className="text-lg font-bold text-yellow-600">{tasks.filter(t => t.status === 'pending').length}</div>
          <div className="text-xs text-gray-600">قيد الانتظار</div>
        </div>
      </div>

      {/* قائمة المهام */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">لا توجد مهام تطابق المعايير المحددة</div>
          <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">
            إضافة مهمة جديدة
          </button>
        </div>
      )}
    </div>
  );
};
