import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Collaborator {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
  isTyping?: boolean;
}

interface CursorTrackerProps {
  collaborators: Collaborator[];
  currentUserId: string;
  canvasOffset: { x: number; y: number };
  scale: number;
}

export const CursorTracker: React.FC<CursorTrackerProps> = ({
  collaborators,
  currentUserId,
  canvasOffset,
  scale
}) => {
  const activeCursors = collaborators.filter(
    c => c.isOnline && c.id !== currentUserId && c.cursor
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {activeCursors.map((collaborator) => {
          if (!collaborator.cursor) return null;

          const cursorX = (collaborator.cursor.x * scale) + canvasOffset.x;
          const cursorY = (collaborator.cursor.y * scale) + canvasOffset.y;

          return (
            <motion.div
              key={collaborator.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute"
              style={{
                left: cursorX,
                top: cursorY,
                transform: 'translate(-2px, -2px)'
              }}
            >
              {/* Cursor pointer */}
              <div className="relative">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  className="drop-shadow-md"
                >
                  <path
                    d="M2 2l5.09 12.95L10 10l4.95 2.09L2 2z"
                    fill={collaborator.color}
                    stroke="white"
                    strokeWidth="1"
                  />
                </svg>
                
                {/* User name label */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-5 left-2 whitespace-nowrap"
                >
                  <div 
                    className="px-2 py-1 rounded text-white text-xs font-medium shadow-lg"
                    style={{ backgroundColor: collaborator.color }}
                  >
                    {collaborator.name}
                    {collaborator.isTyping && (
                      <span className="ml-1 animate-pulse">✏️</span>
                    )}
                  </div>
                </motion.div>

                {/* Ripple effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute top-1 left-1 w-4 h-4 rounded-full"
                  style={{ backgroundColor: collaborator.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};