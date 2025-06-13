
import React from 'react';
import { Users, UserPlus } from 'lucide-react';

export const DashboardTeamCard: React.FC = () => {
  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          الفريق
        </h3>
        <Users size={20} className="text-gray-600" />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex -space-x-2 mb-4 justify-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-sm font-bold">
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          <button className="w-10 h-10 rounded-full bg-white/30 border-2 border-white flex items-center justify-center hover:bg-white/40 transition-colors">
            <UserPlus size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">8</div>
          <div className="text-sm text-gray-600 font-arabic">أعضاء الفريق</div>
        </div>
      </div>
    </div>
  );
};
