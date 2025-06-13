
import React from 'react';
import { Users, UserPlus } from 'lucide-react';

const teamMembers = [
  { id: 1, name: 'أحمد محمد', role: 'مطور أول', avatar: '👨‍💻', status: 'online' },
  { id: 2, name: 'فاطمة علي', role: 'مصممة UI/UX', avatar: '👩‍🎨', status: 'online' },
  { id: 3, name: 'محمد حسن', role: 'مطور خلفية', avatar: '👨‍💼', status: 'away' },
  { id: 4, name: 'نور الدين', role: 'مختبر جودة', avatar: '👨‍🔬', status: 'offline' }
];

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-400'
};

export const TeamCard: React.FC = () => {
  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">الفريق</h3>
        <div className="flex items-center gap-1 text-sm text-gray-600 font-arabic">
          <Users size={16} />
          {teamMembers.length}
        </div>
      </div>

      {/* قائمة أعضاء الفريق */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors duration-200">
            <div className="relative">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">
                {member.avatar}
              </div>
              <div 
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusColors[member.status]}`}
              />
            </div>
            
            <div className="flex-1 text-right">
              <div className="font-medium text-gray-800 font-arabic text-sm">
                {member.name}
              </div>
              <div className="text-xs text-gray-600 font-arabic">
                {member.role}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* زر إضافة عضو جديد */}
      <button className="mt-4 w-full p-2 border-2 border-dashed border-gray-300 rounded-lg
                       text-gray-600 hover:text-gray-800 hover:border-gray-400
                       transition-colors duration-200 flex items-center justify-center gap-2
                       font-arabic">
        <UserPlus size={16} />
        إضافة عضو جديد
      </button>
    </div>
  );
};
