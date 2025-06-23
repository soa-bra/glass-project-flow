
import React from 'react';
import { Plus } from 'lucide-react';

export const TaskListHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-arabic font-semibold text-gray-800">قائمة المهام</h3>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/80 transition-colors">
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
        <button className="w-8 h-8 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/80 transition-colors">
          <span className="text-sm text-gray-600">•••</span>
        </button>
      </div>
    </div>
  );
};
