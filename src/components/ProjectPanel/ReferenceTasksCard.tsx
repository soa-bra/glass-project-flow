
import React from 'react';
import { Plus, Filter } from 'lucide-react';
import { useLovableConfig } from '../../hooks/useLovableConfig';

interface ReferenceTasksCardProps {
  tasks: any[];
}

export const ReferenceTasksCard: React.FC<ReferenceTasksCardProps> = ({ tasks }) => {
  const config = useLovableConfig();

  const taskStatusColors = {
    'completed': '#4CAF50',
    'in_progress': '#FF9800', 
    'pending': '#F44336',
    'review': '#FFC107'
  };

  const statusLabels = {
    'completed': 'سليمة',
    'in_progress': 'تطوير مسودة',
    'pending': 'معطلة',
    'review': 'مؤجلة'
  };

  return (
    <div
      className="h-full rounded-[20px] p-6"
      style={{
        background: config.theme.glass.bg,
        backdropFilter: config.theme.glass.backdrop,
        border: config.theme.glass.border,
        boxShadow: config.theme.glass.shadow
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 
          className="text-xl font-bold"
          style={{ 
            fontFamily: config.theme.font,
            color: config.theme.colors.textPrimary
          }}
        >
          المهام
        </h3>
        <div className="flex gap-2">
          <button 
            className="w-8 h-8 rounded-full bg-white/50 hover:bg-white/70 flex items-center justify-center transition-all"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <Filter size={16} className="text-gray-600" />
          </button>
          <button 
            className="w-8 h-8 rounded-full bg-white/50 hover:bg-white/70 flex items-center justify-center transition-all"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <Plus size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Add Task Button */}
      <button
        className="w-full p-4 mb-4 rounded-[12px] border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all text-center"
        style={{
          fontFamily: config.theme.font,
          color: config.theme.colors.textSecondary
        }}
      >
        + إضافة مهمة
      </button>

      {/* Tasks List */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {tasks.slice(0, 4).map((task, index) => {
          const status = ['completed', 'in_progress', 'pending', 'review'][index % 4] as keyof typeof taskStatusColors;
          return (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 rounded-[10px] bg-white/30 hover:bg-white/40 transition-all"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: taskStatusColors[status] }}
                />
                <div>
                  <div 
                    className="text-sm font-medium"
                    style={{ 
                      fontFamily: config.theme.font,
                      color: config.theme.colors.textPrimary
                    }}
                  >
                    تطوير الموقع الإلكتروني
                  </div>
                  <div 
                    className="text-xs"
                    style={{ 
                      fontFamily: config.theme.font,
                      color: config.theme.colors.textSecondary
                    }}
                  >
                    تطوير موقع سويرلا
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${taskStatusColors[status]}20`,
                    color: taskStatusColors[status],
                    fontFamily: config.theme.font
                  }}
                >
                  {statusLabels[status]}
                </span>
                <span 
                  className="text-xs mt-1"
                  style={{ 
                    fontFamily: config.theme.font,
                    color: config.theme.colors.textSecondary
                  }}
                >
                  20May25
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
