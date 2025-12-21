/**
 * RemoteCursors Component - Sprint 8
 * عرض مؤشرات المتعاونين على اللوحة
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';

interface RemoteCursor {
  odId: string;
  id?: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

interface RemoteCursorsProps {
  cursors: RemoteCursor[];
  viewport: {
    zoom: number;
    pan: { x: number; y: number };
  };
}

export const RemoteCursors: React.FC<RemoteCursorsProps> = ({ cursors, viewport }) => {
  return (
    <div 
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      <AnimatePresence>
        {cursors.map((cursor) => {
          // تحويل الإحداثيات من world space إلى screen space
          const screenX = cursor.x * viewport.zoom + viewport.pan.x;
          const screenY = cursor.y * viewport.zoom + viewport.pan.y;

            return (
              <motion.div
                key={cursor.odId || cursor.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: screenX,
                y: screenY,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 25,
                mass: 0.5
              }}
              className="absolute top-0 left-0"
              style={{ 
                willChange: 'transform',
              }}
            >
              {/* المؤشر */}
              <div className="relative">
                <MousePointer2
                  className="drop-shadow-lg"
                  style={{
                    color: cursor.color,
                    fill: cursor.color,
                    width: 24,
                    height: 24,
                    transform: 'rotate(-15deg)',
                  }}
                />
                
                {/* اسم المستخدم */}
                <div
                  className="absolute top-5 left-4 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium text-white shadow-md"
                  style={{ 
                    backgroundColor: cursor.color,
                    maxWidth: 120,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {cursor.name}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
