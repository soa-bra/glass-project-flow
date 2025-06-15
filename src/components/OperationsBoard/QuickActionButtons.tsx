
import React from 'react';
import { Plus, Zap, Edit3 } from 'lucide-react';

export const QuickActionButtons: React.FC = () => {
  return (
    <div className="absolute top-[120px] left-8 flex flex-col gap-3 z-50">
      <button className="w-12 h-12 rounded-full bg-[#4AB5FF] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
        <Plus size={24} />
      </button>
      <button className="w-12 h-12 rounded-full bg-[#FFCC55] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
        <Zap size={24} />
      </button>
      <button className="w-12 h-12 rounded-full bg-[#999999] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
        <Edit3 size={24} />
      </button>
    </div>
  );
};
