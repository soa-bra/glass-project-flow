
import React from 'react';
import { Plus } from 'lucide-react';

export const TaskListHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 
        className="font-arabic"
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#000000',
          fontFamily: 'IBM Plex Sans Arabic'
        }}
      >
        قائمة المهام
      </h3>
      <div className="flex items-center gap-2">
        <button 
          className="flex items-center justify-center hover:scale-105 transition-transform"
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px'
          }}
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
        <button 
          className="flex items-center justify-center hover:scale-105 transition-transform"
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px'
          }}
        >
          <span className="text-lg text-gray-600 font-bold">•••</span>
        </button>
      </div>
    </div>
  );
};
