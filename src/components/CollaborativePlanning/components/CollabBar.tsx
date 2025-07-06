import React from 'react';
import { Users, MessageCircle, Share2, Clock, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: 'project_manager' | 'team_member' | 'guest';
}

interface CollabBarProps {
  activeUsers: User[];
  onClose: () => void;
}

export const CollabBar: React.FC<CollabBarProps> = ({
  activeUsers,
  onClose
}) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'project_manager': return 'مدير مشروع';
      case 'team_member': return 'عضو فريق';
      case 'guest': return 'ضيف';
      default: return 'مستخدم';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'project_manager': return 'text-blue-600';
      case 'team_member': return 'text-green-600';
      case 'guest': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="absolute top-20 left-4 glass-section rounded-lg p-4 min-w-64 z-40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Users size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">التعاون المباشر</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/30 rounded"
        >
          <X size={14} className="text-gray-500" />
        </button>
      </div>

      {/* Active Users List */}
      <div className="space-y-2 mb-4">
        {activeUsers.map((user) => (
          <div key={user.id} className="flex items-center space-x-3 space-x-reverse">
            <div className="relative">
              <div 
                className="w-8 h-8 rounded-full border-2 overflow-hidden"
                style={{ borderColor: user.color }}
              >
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div 
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                style={{ backgroundColor: user.color }}
              ></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {user.name}
                </span>
                <span className={`text-xs ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>نشط الآن</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-2 space-x-reverse pt-3 border-t border-gray-200">
        <button className="flex-1 flex items-center justify-center space-x-1 space-x-reverse py-2 px-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 text-xs font-medium transition-colors">
          <MessageCircle size={12} />
          <span>دردشة</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center space-x-1 space-x-reverse py-2 px-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 text-xs font-medium transition-colors">
          <Share2 size={12} />
          <span>مشاركة</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center space-x-1 space-x-reverse py-2 px-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 text-xs font-medium transition-colors">
          <Clock size={12} />
          <span>السجل</span>
        </button>
      </div>

      {/* Connection Status */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>متصل - آخر مزامنة منذ ثانية واحدة</span>
        </div>
      </div>
    </div>
  );
};