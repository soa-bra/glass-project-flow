import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollaborationStore } from '../../../store/collaboration.store';

export const LiveCursors: React.FC = () => {
  const { liveCursors, connectedUsers, currentUserId } = useCollaborationStore();
  const [visibleCursors, setVisibleCursors] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    const updateVisibleCursors = () => {
      const newVisibleCursors = new Map();
      
      liveCursors.forEach((cursor, userId) => {
        if (userId === currentUserId) return; // Don't show own cursor
        
        const user = connectedUsers.get(userId) as any;
        if (!user || !cursor.position) return;

        // Check if cursor is within viewport or recently active
        const isRecentlyActive = Date.now() - cursor.timestamp < 5000; // 5 seconds
        
        if (isRecentlyActive) {
          newVisibleCursors.set(userId, {
            cursor,
            user,
            isActive: Date.now() - cursor.timestamp < 100 // Very recent
          });
        }
      });

      setVisibleCursors(newVisibleCursors);
    };

    updateVisibleCursors();
    const interval = setInterval(updateVisibleCursors, 100);

    return () => clearInterval(interval);
  }, [liveCursors, connectedUsers, currentUserId]);

  const getCursorColor = (userId: string) => {
    // Generate consistent color based on user ID
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
    ];
    
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {Array.from(visibleCursors.entries()).map(([userId, { cursor, user, isActive }]) => (
          <motion.div
            key={userId}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isActive ? 1 : 0.7, 
              scale: 1,
              x: cursor.position.x,
              y: cursor.position.y
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute"
            style={{
              transform: `translate(${cursor.position.x}px, ${cursor.position.y}px)`
            }}
          >
            {/* Cursor pointer */}
            <div className="relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="drop-shadow-lg"
              >
                <path
                  d="M5 3L19 12L12 14L9 19L5 3Z"
                  className={`${getCursorColor(userId)} fill-current`}
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>

              {/* User name label */}
              <div className="absolute top-6 left-2 bg-black/80 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap">
                {user.displayName}
                {cursor.action && (
                  <span className="text-gray-300 ml-1">
                    • {cursor.action}
                  </span>
                )}
              </div>

              {/* Selection indicator */}
              {cursor.isSelecting && (
                <div className="absolute top-0 left-0 w-3 h-3 bg-white border-2 border-current rounded-full animate-pulse" />
              )}

              {/* Tool indicator */}
              {cursor.tool && cursor.tool !== 'select' && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent-blue rounded-full flex items-center justify-center text-xs">
                  {cursor.tool === 'pen' && '✏️'}
                  {cursor.tool === 'zoom' && '🔍'}
                  {cursor.tool === 'pan' && '👋'}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};