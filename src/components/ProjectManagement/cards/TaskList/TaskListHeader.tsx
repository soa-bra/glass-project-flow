
import React from 'react';
import { Plus } from 'lucide-react';

export const TaskListHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-arabic font-bold text-gray-800">قائمة المهام</h3>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/80 transition-colors">
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-9 h-9 bg-white/60 backdrop-filter backdrop-blur-lg border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/80 transition-colors">
          <span className="text-lg text-gray-600 font-bold">•••</span>
        </button>
      </div>
    </div>
  );
};
