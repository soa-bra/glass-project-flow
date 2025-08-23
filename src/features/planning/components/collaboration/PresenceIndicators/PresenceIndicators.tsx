import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollaborationStore } from '../../../store/collaboration.store';

export const PresenceIndicators: React.FC = () => {
  const { connectedUsers, currentUserId } = useCollaborationStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-accent-green';
      case 'idle': return 'bg-accent-yellow';
      case 'in_voice_chat': return 'bg-accent-blue';
      case 'screen_sharing': return 'bg-purple-500';
      case 'away': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'idle': return 'خامل';
      case 'in_voice_chat': return 'في مكالمة صوتية';
      case 'screen_sharing': return 'مشاركة الشاشة';
      case 'away': return 'بعيد';
      default: return 'غير متصل';
    }
  };

  const otherUsers = Array.from(connectedUsers.values()).filter(
    (user: any) => user.userId !== currentUserId
  );

  if (otherUsers.length === 0) {
    return (
      <div className="fixed top-4 right-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-black/10 p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-xs text-black/60">تعمل بمفردك</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-black/10 p-3 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold text-black">المتعاونون ({otherUsers.length})</span>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence>
          {otherUsers.map((user: any) => (
            <motion.div
              key={user.userId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 p-2 bg-white/60 rounded-xl"
            >
              {/* Avatar */}
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-green rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Status indicator */}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`}
                  title={getStatusText(user.status)}
                />
              </div>

              {/* User info */}
              <div className="flex-1">
                <div className="text-sm font-medium text-black">
                  {user.displayName}
                </div>
                <div className="text-xs text-black/60">
                  {user.currentTool && `يستخدم: ${user.currentTool}`}
                </div>
              </div>

              {/* Role badge */}
              {user.role && user.role !== 'member' && (
                <div className="px-2 py-1 bg-accent-blue/20 text-accent-blue text-xs rounded-lg">
                  {user.role === 'owner' && 'مالك'}
                  {user.role === 'admin' && 'مدير'}
                  {user.role === 'editor' && 'محرر'}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Total users count */}
      <div className="mt-2 pt-2 border-t border-black/10 text-center">
        <span className="text-xs text-black/60">
          {connectedUsers.size} {connectedUsers.size === 1 ? 'مستخدم' : 'مستخدمين'} متصلين
        </span>
      </div>
    </div>
  );
};