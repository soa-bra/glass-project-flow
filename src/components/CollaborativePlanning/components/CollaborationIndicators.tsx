import React from 'react';
import { Users, Eye, Edit, MessageCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  cursor?: { x: number; y: number };
  color: string;
}

interface CollaborationIndicatorsProps {
  activeUsers: User[];
}

export const CollaborationIndicators: React.FC<CollaborationIndicatorsProps> = ({
  activeUsers
}) => {
  return (
    <>
      {/* Active Users Panel */}
      <div className="absolute top-20 right-4 glass-section rounded-lg p-3 z-40">
        <div className="flex items-center space-x-2 space-x-reverse mb-2">
          <Users size={14} className="text-gray-600" />
          <span className="text-xs font-medium text-gray-700">المستخدمون النشطون</span>
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          {activeUsers.map((user) => (
            <div key={user.id} className="relative group">
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
              
              {/* Status indicator */}
              <div 
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                style={{ backgroundColor: user.color }}
              ></div>
              
              {/* Tooltip */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {user.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Activity indicators */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center space-x-1 space-x-reverse text-xs text-green-600">
            <Edit size={10} />
            <span>أحمد يحرر عنصر</span>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse text-xs text-blue-600">
            <Eye size={10} />
            <span>فاطمة تتابع</span>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse text-xs text-orange-600">
            <MessageCircle size={10} />
            <span>محمد يعلق</span>
          </div>
        </div>
      </div>

      {/* Live cursors (would be rendered based on real cursor positions) */}
      {activeUsers.map((user) => 
        user.cursor && (
          <div
            key={`cursor-${user.id}`}
            className="absolute pointer-events-none z-50 transition-all duration-100"
            style={{
              left: user.cursor.x,
              top: user.cursor.y,
              transform: 'translate(-2px, -2px)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M0 0L20 7L8 10L5 20L0 0Z"
                fill={user.color}
                stroke="white"
                strokeWidth="1"
              />
            </svg>
            <div 
              className="ml-2 mt-1 px-2 py-1 text-xs text-white rounded shadow-lg whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </div>
        )
      )}

      {/* Connection status */}
      <div className="absolute top-20 left-4 glass-section rounded-lg p-2 z-40">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">متصل</span>
        </div>
      </div>

      {/* Recent activities */}
      <div className="absolute bottom-4 right-4 glass-section rounded-lg p-3 max-w-xs z-40">
        <div className="text-xs font-medium text-gray-700 mb-2">النشاطات الأخيرة</div>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center space-x-1 space-x-reverse">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>أحمد أضاف ملاحظة جديدة</span>
            <span className="text-gray-400">منذ دقيقة</span>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>فاطمة حدثت النص</span>
            <span className="text-gray-400">منذ 3 دقائق</span>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            <span>محمد أضاف تعليق</span>
            <span className="text-gray-400">منذ 5 دقائق</span>
          </div>
        </div>
      </div>
    </>
  );
};